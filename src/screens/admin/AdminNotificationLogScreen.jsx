import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { useIoT } from "../../hooks/useIoT";

const AdminNotificationLogScreen = ({ navigation }) => {
  const { notifications, loading, refreshNotificationData } = useIoT();

  const sensorConfigs = {
    temp: {
      label: "Temperature",
      icon: "thermometer",
      color: "#EF4444",
      bg: "#FEE2E2",
    },
    soil: {
      label: "Soil moisture",
      icon: "leaf-outline",
      color: "#10B981",
      bg: "#D1FAE5",
    },
    light: {
      label: "Light",
      icon: "sunny",
      color: "#F59E0B",
      bg: "#FEF3C7",
    },
  };

  const renderItem = ({ item }) => {
    const config = sensorConfigs[item.sensor_type] || {
      label: "System",
      icon: "alert-circle",
      color: "#6B7280",
      bg: "#F3F4F6",
    };

    return (
      <View style={styles.card}>
        <View style={[styles.iconBox, { backgroundColor: config.bg }]}>
          <Ionicons name={config.icon} size={22} color={config.color} />
        </View>

        <View style={styles.content}>
          <View style={styles.topRow}>
            <View style={styles.userTag}>
              <Ionicons
                name="person-circle-outline"
                size={12}
                color="#2f6b3f"
              />
              <Text style={styles.userName}>
                {item.username || `User #${item.user_id}`}
              </Text>
            </View>
            <Text style={styles.time}>
              {moment(item.created_at).format("HH:mm - DD/MM")}
            </Text>
          </View>

          <Text style={styles.title}>Warning {config.label}</Text>

          <Text style={styles.message}>{item.message}</Text>

          <View style={styles.footerRow}>
            <Text style={styles.valueText}>
              Value:{" "}
              <Text style={{ fontWeight: "700" }}>{item.current_value}</Text>
            </Text>
            <Text style={styles.valueText}>
              Threshold: {item.threshold_value}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    refreshNotificationData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header Admin */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>System Logs</Text>
          <Text style={styles.headerSub}>
            User's notifications management system
          </Text>
        </View>

        <TouchableOpacity
          onPress={refreshNotificationData}
          style={styles.refreshBtn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="refresh-outline" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshNotificationData}
            tintColor="#2f6b3f"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={60} color="#D1D5DB" />
            <Text style={styles.emptyText}>There is no notifications yet.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 45,
    padding: 30,
    backgroundColor: "#2f6b3f",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitleContainer: { flex: 1, marginLeft: 20 },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerSub: { fontSize: 12, color: "#676c74" },
  listContent: { padding: 16 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: { flex: 1 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  userTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  userName: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2f6b3f",
    marginLeft: 4,
  },
  time: { fontSize: 11, color: "#9CA3AF" },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  message: { fontSize: 13, color: "#4B5563", lineHeight: 18, marginBottom: 8 },
  footerRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 8,
  },
  valueText: { fontSize: 12, color: "#6B7280", marginRight: 15 },
  emptyContainer: { alignItems: "center", marginTop: 100 },
  emptyText: {
    textAlign: "center",
    marginTop: 15,
    color: "#9CA3AF",
    paddingHorizontal: 40,
  },
});

export default AdminNotificationLogScreen;
