import { Ionicons } from "@expo/vector-icons";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import type { AppStackParamList } from "@/app/navigation/types";
import {
  detailPalette,
  fontFamily as font,
  palette,
} from "@/shared/theme/tokens";
import type { CursoDetail } from "../domain/entities/CursoDetail";
import type { ObraDetail } from "../domain/entities/ObraDetail";
import type { DetailError } from "../domain/errors/DetailError";
import { CursoDetailContent } from "./CursoDetailContent";
import { EvidenceViewerModal } from "./EvidenceViewerModal";
import { ObraDetailContent } from "./ObraDetailContent";
import { useDetail } from "./useDetail";

const rootStyle = {
  flex: 1,
  backgroundColor: detailPalette.screenBg,
  paddingHorizontal: 16,
} as const;

const backRowStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 12,
} as const;

const centeredStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
} as const;

const errorStyle = {
  fontFamily: font.lato,
  fontSize: 14,
  color: detailPalette.textMuted,
  textAlign: "center",
} as const;

const scrollContentStyle = {
  paddingBottom: 24,
} as const;

export function DetailScreen() {
  const { useCases } = useDetail();
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<RouteProp<AppStackParamList, "Detail">>();
  const { tipo, id } = route.params;

  const obraQuery = useQuery<ObraDetail, DetailError>({
    queryKey: ["detail", "obra", id],
    queryFn: ({ signal }) => useCases.getObraDetail(id, signal),
    enabled: tipo === "OBRA",
  });

  const cursoQuery = useQuery<CursoDetail, DetailError>({
    queryKey: ["detail", "curso", id],
    queryFn: ({ signal }) => useCases.getCursoDetail(id, signal),
    enabled: tipo === "CURSO",
  });

  const [evidenceUrl, setEvidenceUrl] = useState<string | null>(null);

  const isPending = tipo === "OBRA" ? obraQuery.isPending : cursoQuery.isPending;
  const isError = tipo === "OBRA" ? obraQuery.isError : cursoQuery.isError;

  return (
    <View style={rootStyle}>
      <View style={backRowStyle}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          hitSlop={12}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={palette.texto} />
        </Pressable>
      </View>

      {isPending ? (
        <View style={centeredStyle}>
          <ActivityIndicator size="large" color={palette.guinda} />
        </View>
      ) : isError ? (
        <View style={centeredStyle}>
          <Text style={errorStyle}>No se pudo cargar el detalle.</Text>
        </View>
      ) : tipo === "OBRA" ? (
        obraQuery.data !== undefined ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={scrollContentStyle}
          >
            <ObraDetailContent
              obra={obraQuery.data}
              onPressEvidence={setEvidenceUrl}
            />
          </ScrollView>
        ) : null
      ) : cursoQuery.data !== undefined ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={scrollContentStyle}
        >
          <CursoDetailContent
            curso={cursoQuery.data}
            onPressEvidence={setEvidenceUrl}
          />
        </ScrollView>
      ) : null}

      <EvidenceViewerModal
        url={evidenceUrl}
        onClose={() => setEvidenceUrl(null)}
      />
    </View>
  );
}
