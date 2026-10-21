import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import type { MunicipioRadar } from "../domain/entities/MunicipioRadar";
import { fontFamily as font, palette, radarPalette } from "@/shared/theme/tokens";
import { formatMdp } from "./format";

type MunicipioCalloutProps = {
  municipio: MunicipioRadar;
  onClose: () => void;
};

const cardStyle: ViewStyle = {
  alignSelf: "center",
  width: "88%",
  maxWidth: 340,
  marginTop: 16,
  zIndex: 20,
};

const headerStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
  backgroundColor: radarPalette.popupHeader,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingVertical: 12,
  paddingHorizontal: 16,
};

const headerNameStyle: TextStyle = {
  flex: 1,
  fontFamily: font["lato-bold"],
  fontSize: 20,
  color: palette.texto,
  textTransform: "uppercase",
};

const bodyStyle: ViewStyle = {
  backgroundColor: radarPalette.popupBody,
  borderBottomLeftRadius: 16,
  borderBottomRightRadius: 16,
  paddingVertical: 14,
};

const columnsRowStyle: ViewStyle = {
  flexDirection: "row",
};

const columnStyle: ViewStyle = {
  flex: 1,
  alignItems: "center",
  gap: 4,
  paddingHorizontal: 6,
};

const columnDividerStyle: ViewStyle = {
  borderLeftWidth: StyleSheet.hairlineWidth,
  borderLeftColor: "rgba(0,0,0,0.12)",
};

const kpiValueStyle: TextStyle = {
  fontFamily: font["lato-bold"],
  fontSize: 18,
  color: palette.texto,
  textAlign: "center",
};

const kpiLabelStyle: TextStyle = {
  fontFamily: font.lato,
  fontSize: 11,
  color: palette.texto,
  textAlign: "center",
};

const footerStyle: ViewStyle = {
  alignItems: "center",
  paddingHorizontal: 16,
  paddingTop: 12,
};

const seeMoreStyle: ViewStyle = {
  borderWidth: 1,
  borderColor: palette.guinda,
  borderRadius: 999,
  paddingVertical: 10,
  paddingHorizontal: 24,
};

const seeMoreTextStyle: TextStyle = {
  fontFamily: font["lato-bold"],
  color: palette.guinda,
  fontSize: 14,
};

const tailStyle: ViewStyle = {
  alignSelf: "center",
  width: 16,
  height: 16,
  backgroundColor: radarPalette.popupBody,
  transform: [{ rotate: "45deg" }],
  marginBottom: -8,
};

const SHOW_SEE_MORE = false;

// Fase 4: oculto por decisión del Humano 2026-10-20; su flujo = Fase 5 Detalle Municipal

export function MunicipioCallout({
  municipio,
  onClose,
}: MunicipioCalloutProps) {
  return (
    <View style={cardStyle}>
      <View style={headerStyle}>
        <Ionicons name="location-outline" size={22} color={palette.texto} />
        <Text style={headerNameStyle}>{municipio.nombre}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar"
          hitSlop={12}
          onPress={onClose}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <Ionicons name="close" size={20} color={palette.texto} />
        </Pressable>
      </View>

      <View style={bodyStyle}>
        <View style={columnsRowStyle}>
          <View style={columnStyle}>
            <Text style={kpiValueStyle}>
              {formatMdp(municipio.totalInversion)}
            </Text>
            <Text style={kpiLabelStyle}>Inversión total</Text>
          </View>

          <View style={[columnStyle, columnDividerStyle]}>
            <Text style={kpiValueStyle}>{municipio.totalObras}</Text>
            <Text style={kpiLabelStyle}>
              {`Obras (${municipio.obrasEnProceso} en proceso, ${municipio.obrasFinalizadas} concluidas)`}
            </Text>
          </View>

          <View style={[columnStyle, columnDividerStyle]}>
            <Text style={kpiValueStyle}>{municipio.totalCursos}</Text>
            <Text style={kpiLabelStyle}>Capacitaciones</Text>
          </View>
        </View>

        {SHOW_SEE_MORE ? (
          <View style={footerStyle}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ver más (disponible en la siguiente fase)"
              onPress={() => undefined}
              style={({ pressed }) => [
                seeMoreStyle,
                pressed ? { opacity: 0.8 } : null,
              ]}
            >
              <Text style={seeMoreTextStyle}>Ver más</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={tailStyle} />
      </View>
    </View>
  );
}
