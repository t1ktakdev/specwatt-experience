import React from "react";
import { Pressable, Switch, TextInput, View } from "react-native";
import { Copy, NativeIcon, s } from "./components";
import { palette as c } from "./tokens";
export function NativeRow({
  title,
  detail,
  onPress,
}: {
  title: string;
  detail?: string;
  onPress?: () => void;
}) {
  const content = (
    <>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Copy style={[s.section, { flex: 1 }]}>{title}</Copy>
        {onPress && (
          <NativeIcon kind="arrow" size={16} color={c.textSecondary} />
        )}
      </View>
      {detail && <Copy style={s.muted}>{detail}</Copy>}
    </>
  );
  return onPress ? (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [s.row, pressed && s.pressed]}
    >
      {content}
    </Pressable>
  ) : (
    <View style={s.row}>{content}</View>
  );
}
export function NativeToggle({
  label,
  detail,
  value,
  onChange,
  disabled = false,
  emphasis = false,
}: {
  label: string;
  detail?: string;
  value: boolean;
  onChange: () => void;
  disabled?: boolean;
  emphasis?: boolean;
}) {
  return (
    <View style={[s.switchRow, { minHeight: 52 }]}>
      <View style={{ flex: 1 }}>
        <Copy
          style={
            emphasis
              ? { fontSize: 24, lineHeight: 32, fontWeight: "500" }
              : undefined
          }
        >
          {label}
        </Copy>
        {detail && detail !== label && <Copy style={s.muted}>{detail}</Copy>}
      </View>
      <View style={s.switchTouch}>
        <Switch
          accessibilityLabel={label}
          disabled={disabled}
          value={value}
          onValueChange={onChange}
          thumbColor={value ? "#fff0d8" : "#b7beb5"}
          trackColor={{ false: "#444a47", true: c.accentAmber }}
        />
      </View>
    </View>
  );
}
export function NativeField({
  label,
  value,
  onChange,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  keyboardType?: "default" | "url" | "number-pad";
}) {
  return (
    <View style={{ gap: 8 }}>
      <Copy>{label}</Copy>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        inputMode={keyboardType === "number-pad" ? "numeric" : undefined}
        autoCapitalize="none"
        autoCorrect={false}
        style={{
          fontFamily: "Manrope",
          fontSize: 16,
          color: c.textPrimary,
          borderWidth: 1,
          borderColor: "#ffffff25",
          borderRadius: 10,
          padding: 14,
          minHeight: 52,
        }}
      />
    </View>
  );
}
