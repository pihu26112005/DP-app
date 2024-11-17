import React, { useState } from "react";
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const CreateResultUI = () => {
  // Hardcoded data for display
  const [adulterantData, setAdulterantData] = useState({
    isAdulterated: true,
    adulterantType: "Melamine",
    adulterantLevel: "15%", // Hardcoded
    graphData: {
      labels: ["0%", "5%", "10%", "15%", "20%"],
      datasets: [
        {
          data: [0, 5, 10, 15, 20], // Mock values for the graph
          color: () => `rgba(255, 0, 0, 0.5)`, // Red color for highlighting adulteration
        },
      ],
    },
  });

  const handleCheck = async () => {
    // Alert.alert(
    //   "Adulterant Check",
    //   adulterantData.isAdulterated
    //     ? `Adulterant Found: ${adulterantData.adulterantType} at ${adulterantData.adulterantLevel}`
    //     : "Milk is Safe!"
    // );
    const uniqueId = "123"; // Replace with dynamic ID if needed
    const serverIP = "172.16.17.205"; // Replace with your laptop's local IP

    try {
      const response = await fetch(`http://${serverIP}:5000/result?uniqueId=${uniqueId}`);
      const result = await response.json();

      if (response.ok) {
        const { result: { prediction } = {} } = result; // Extract prediction from response
        Alert.alert("Adulteration Result", `Adulterant Level Prediction: ${prediction}%`);
      } else {
        Alert.alert("Error hogyi", result.error || "Failed to fetch result.");
      }
    } catch (error) {
      console.error("Error fetching result:", error);
      Alert.alert("Error", "Failed to connect to the server.");
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-semibold mb-6 mt-8">
          Milk Adulteration Test Results
        </Text>

        {/* Adulterant Indicator */}
        <View
          className={`${adulterantData.isAdulterated ? "bg-red-500" : "bg-green-500"
            } p-4 rounded-xl flex items-center`}
        >
          <Text className="text-white text-xl font-semibold">
            {adulterantData.isAdulterated
              ? "Adulterant Detected"
              : "No Adulterant Found"}
          </Text>
        </View>

        {/* Adulterant Details */}
        {adulterantData.isAdulterated && (
          <View className="mt-6">
            <Text className="text-lg text-gray-100 font-medium">
              Adulterant Type:{" "}
              <Text className="font-semibold">{adulterantData.adulterantType}</Text>
            </Text>
            <Text className="text-lg text-gray-100 font-medium mt-3">
              Adulterant Level:{" "}
              <Text className="font-semibold">{adulterantData.adulterantLevel}</Text>
            </Text>
          </View>
        )}

        {/* Graph for Adulterant Level */}
        <Text className="text-lg text-gray-100 font-semibold mt-10">
          Adulterant Level Graph
        </Text>
        <LineChart
          data={adulterantData.graphData}
          width={screenWidth * 0.9} // from react-native
          height={220}
          chartConfig={{
            backgroundColor: "#1e2923",
            backgroundGradientFrom: "#08130d",
            backgroundGradientTo: "#08130d",
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            strokeWidth: 2, // optional, default 3
          }}
          style={{
            marginVertical: 10,
            borderRadius: 16,
          }}
        />

        {/* Check Result Button */}
        <TouchableOpacity
          className="mt-8 p-4 bg-blue-600 rounded-xl flex items-center"
          onPress={handleCheck}
        >
          <Text className="text-white text-lg">Check Result</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateResultUI;
