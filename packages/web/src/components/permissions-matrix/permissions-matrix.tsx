import * as React from "react"

import { cn } from "../../lib/utils"

export interface PermissionDefinition {
  id: string
  label: string
  category?: string
}

export type PermissionsMatrixValue = Record<string, string[]>

export interface PermissionsMatrixProps extends React.HTMLAttributes<HTMLDivElement> {
  roles: string[]
  permissions: PermissionDefinition[]
  value?: PermissionsMatrixValue
  onValueChange?: (value: PermissionsMatrixValue) => void
}

const PermissionsMatrix = React.forwardRef<HTMLDivElement, PermissionsMatrixProps>(
  ({ className, roles, permissions, value, onValueChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<PermissionsMatrixValue>(value ?? {})

    React.useEffect(() => {
      if (value) setInternalValue(value)
    }, [value])

    const emit = (next: PermissionsMatrixValue) => {
      setInternalValue(next)
      onValueChange?.(next)
    }

    const toggleCell = (role: string, permissionId: string) => {
      const rolePermissions = internalValue[role] ?? []
      const nextRolePermissions = rolePermissions.includes(permissionId)
        ? rolePermissions.filter((id) => id !== permissionId)
        : [...rolePermissions, permissionId]

      emit({ ...internalValue, [role]: nextRolePermissions })
    }

    const toggleRole = (role: string) => {
      const current = internalValue[role] ?? []
      const allPermissionIds = permissions.map((permission) => permission.id)
      const next = current.length === allPermissionIds.length ? [] : allPermissionIds
      emit({ ...internalValue, [role]: next })
    }

    return (
      <div ref={ref} className={cn("overflow-hidden rounded-xl border", className)} {...props}>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left">Permission</th>
                {roles.map((role) => (
                  <th key={role} className="min-w-28 px-3 py-2 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <span>{role}</span>
                      <button
                        type="button"
                        className="rounded border px-2 py-0.5 text-xs"
                        onClick={() => toggleRole(role)}
                      >
                        Toggle all
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((permission) => (
                <tr key={permission.id} className="border-t">
                  <td className="px-3 py-2">
                    <div className="font-medium">{permission.label}</div>
                    {permission.category ? (
                      <div className="text-xs text-muted-foreground">{permission.category}</div>
                    ) : null}
                  </td>
                  {roles.map((role) => {
                    const checked = (internalValue[role] ?? []).includes(permission.id)
                    return (
                      <td key={`${role}-${permission.id}`} className="px-3 py-2">
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleCell(role, permission.id)}
                            aria-label={`${role} ${permission.label}`}
                          />
                          <span className="text-xs text-muted-foreground">{checked ? "Allow" : "Deny"}</span>
                        </label>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
)
PermissionsMatrix.displayName = "PermissionsMatrix"

export { PermissionsMatrix }
