import React from 'react'
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize, fontWeight } from '@tesserix/tokens/typography'

export interface ContactCardProps {
  /** Contact name */
  name: string
  /** Role or job title */
  role?: string
  /** Company name */
  company?: string
  /** Email address */
  email?: string
  /** Phone number */
  phone?: string
  /** Avatar image URL or emoji */
  avatar?: string
  /** Callback when email is pressed */
  onEmailPress?: () => void
  /** Callback when phone is pressed */
  onPhonePress?: () => void
  /** Custom container style */
  style?: ViewStyle
  /** Test ID for testing */
  testID?: string
}

/**
 * ContactCard component - Business contact card with name, role, company, contact info
 *
 * @example
 * ```tsx
 * <ContactCard
 *   name="John Doe"
 *   role="Senior Engineer"
 *   company="Tech Corp"
 *   email="john@techcorp.com"
 *   phone="+1 555-1234"
 *   avatar="👤"
 * />
 * ```
 */
export const ContactCard: React.FC<ContactCardProps> = ({
  name,
  role,
  company,
  email,
  phone,
  avatar,
  onEmailPress,
  onPhonePress,
  style,
  testID,
}) => {
  const containerStyle: ViewStyle = {
    backgroundColor: '#ffffff',
    padding: spacing[4],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  }

  const headerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
  }

  const avatarStyle: ViewStyle = {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  }

  const avatarTextStyle: TextStyle = {
    fontSize: fontSize['2xl'],
  }

  const infoContainerStyle: ViewStyle = {
    flex: 1,
  }

  const nameStyle: TextStyle = {
    fontSize: fontSize.lg,
    fontWeight: String(fontWeight.bold) as TextStyle['fontWeight'],
    color: '#111827',
    marginBottom: spacing[1],
  }

  const roleStyle: TextStyle = {
    fontSize: fontSize.base,
    color: '#6b7280',
    marginBottom: spacing[0.5],
  }

  const companyStyle: TextStyle = {
    fontSize: fontSize.sm,
    color: '#9ca3af',
  }

  const contactInfoStyle: ViewStyle = {
    marginTop: spacing[2],
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  }

  const contactItemStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
  }

  const iconStyle: TextStyle = {
    fontSize: fontSize.base,
    marginRight: spacing[2],
    width: 20,
  }

  const contactTextStyle: TextStyle = {
    fontSize: fontSize.base,
    color: '#374151',
    flex: 1,
  }

  const linkTextStyle: TextStyle = {
    ...contactTextStyle,
    color: '#3b82f6',
  }

  return (
    <View
      style={[containerStyle, style]}
      testID={testID}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`Contact: ${name}${role ? `, ${role}` : ''}${company ? ` at ${company}` : ''}`}
    >
      <View style={headerStyle}>
        <View style={avatarStyle}>
          <Text style={avatarTextStyle} accessible={false}>
            {avatar ?? name.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={infoContainerStyle}>
          <Text style={nameStyle}>{name}</Text>
          {role && <Text style={roleStyle}>{role}</Text>}
          {company && <Text style={companyStyle}>{company}</Text>}
        </View>
      </View>

      {(email || phone) && (
        <View style={contactInfoStyle}>
          {email && (
            <TouchableOpacity
              style={contactItemStyle}
              onPress={onEmailPress}
              disabled={!onEmailPress}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`Email ${email}`}
            >
              <Text style={iconStyle} accessible={false}>
                ✉️
              </Text>
              <Text style={onEmailPress ? linkTextStyle : contactTextStyle}>{email}</Text>
            </TouchableOpacity>
          )}

          {phone && (
            <TouchableOpacity
              style={contactItemStyle}
              onPress={onPhonePress}
              disabled={!onPhonePress}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`Phone ${phone}`}
            >
              <Text style={iconStyle} accessible={false}>
                📞
              </Text>
              <Text style={onPhonePress ? linkTextStyle : contactTextStyle}>{phone}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  )
}

ContactCard.displayName = 'ContactCard'
