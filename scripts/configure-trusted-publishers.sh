#!/usr/bin/env bash
#
# Configures npm trusted publishing (OIDC) for every published package in this
# monorepo except @tesserix/web, which is already configured.
#
# Why this exists: `changeset publish` publishes any workspace package whose
# version is not yet on the registry. Since publishing moved to trusted
# publishing there is no NPM_TOKEN to fall back on, so a package without its own
# trusted publisher fails the moment its version is bumped — and it fails in the
# release job, after the version commit has already landed on main.
#
# Requires:
#   - npm CLI >= 11.10.0 (`npm trust` was added there)
#   - `npm login` with an account that can publish the @tesserix scope
#   - account-level 2FA. The first call prompts; npmjs.com then offers to skip
#     2FA for 5 minutes, which is long enough for the whole loop.
#
# Usage:  ./scripts/configure-trusted-publishers.sh
#
set -euo pipefail

REPO="tesserix/design-system"
WORKFLOW="ci-cd.yml"   # must match the workflow filename exactly, case-sensitive

# @tesserix/web is deliberately absent: it is already configured and working.
PACKAGES=(
  "@tesserix/hooks"
  "@tesserix/icons"
  "@tesserix/native"
  "@tesserix/otto-widget"
  "@tesserix/tokens"
  "@tesserix/utils"
)

if ! npm whoami --registry https://registry.npmjs.org >/dev/null 2>&1; then
  echo "Not logged in to npm. Run: npm login --registry https://registry.npmjs.org" >&2
  exit 1
fi

echo "Configuring trusted publishers as $(npm whoami) for ${REPO} (${WORKFLOW})"
echo

failed=()
for pkg in "${PACKAGES[@]}"; do
  echo "==> ${pkg}"
  if npm trust github "${pkg}" --file "${WORKFLOW}" --repo "${REPO}" --allow-publish --yes; then
    echo "    ok"
  else
    echo "    FAILED" >&2
    failed+=("${pkg}")
  fi
  # npm's own guidance: pause between calls so the bulk loop is not rate limited.
  sleep 2
done

echo
if [ ${#failed[@]} -gt 0 ]; then
  echo "Failed for: ${failed[*]}" >&2
  echo "If npm rejects the call for a missing environment, re-run that package with" >&2
  echo "  --env <name>  matching the GitHub environment the release job uses." >&2
  exit 1
fi

echo "All packages configured. Verify with:  npm trust list <package>"
