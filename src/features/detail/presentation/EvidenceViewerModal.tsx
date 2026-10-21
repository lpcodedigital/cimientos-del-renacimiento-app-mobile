import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Modal, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { palette } from "@/shared/theme/tokens";

type EvidenceViewerModalProps = {
  url: string | null;
  onClose: () => void;
};

const overlayStyle = {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.92)",
} as const;

const imageStyle = {
  flex: 1,
} as const;

const closeButtonStyle = {
  position: "absolute",
  right: 24,
} as const;

export function EvidenceViewerModal({
  url,
  onClose,
}: EvidenceViewerModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={url !== null}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={overlayStyle}>
        <Image
          source={{ uri: url ?? "" }}
          style={imageStyle}
          contentFit="contain"
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar"
          hitSlop={12}
          onPress={onClose}
          style={[closeButtonStyle, { top: insets.top + 12 }]}
        >
          <Ionicons name="close" size={28} color={palette.superficie} />
        </Pressable>
      </View>
    </Modal>
  );
}
