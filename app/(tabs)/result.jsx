import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, ActivityIndicator, Dimensions } from 'react-native';
// import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
// import { G, Line } from 'react-native-svg';
import PieChart from 'react-native-pie-chart'
import CustomButton from '../../components/CustomButton';

const ResultPage = () => {
  const [latestResult, setLatestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dielectricValue, setDielectricValue] = useState(null);
  const [volume, setVolume] = useState(null);

  const fetchLatestResult = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://dp-project-theta.vercel.app/api/getLatestResult');
      const data = await response.json();
      setLatestResult(data);
      extractValue(data.matched_file_name);
    } catch (error) {
      console.error('Error fetching latest result:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestResult();
  }, []);

  const handleCheckResult = () => {
    fetchLatestResult();
  };

  const extractValue = (fileName) => {
    const match = fileName.match(/DK_(\d+\.\d+)\.csv/);
    if (match) {
      const dielectricConstant = parseFloat(match[1]);
      setDielectricValue(dielectricConstant);
      calculateVolume(dielectricConstant);
    }
  };

  const calculateVolume = (er) => {
    const emelamine = 6;
    const emilk = 40;
    const erCubedRoot = Math.cbrt(er);
    const emelamineCubedRoot = Math.cbrt(emelamine);
    const emilkCubedRoot = Math.cbrt(emilk);

    const v = (erCubedRoot - emilkCubedRoot) / (emelamineCubedRoot - emilkCubedRoot);
    setVolume(v);
  };

  const prepareChartData = (freqArray, valuesArray) => {
    // Remove the first two null values
    const filteredFreq = freqArray.slice(2);
    const filteredValues = valuesArray.slice(2);

    return filteredValues;
  };

  const widthAndHeight = 250;
  const series = volume !== null ? [volume * 100, (1 - volume) * 100] : [0, 100];
  const sliceColor = ['#3f2305', '#776b5d'];

  return (
    <SafeAreaView className="bg-bkk h-full">
      <ScrollView className="px-4 my-6">
        <View className="mt-7 space-y-2">
          <CustomButton
            title="Check Result"
            handlePress={handleCheckResult}
            customStyle="mt-7"
            isLoading={loading}
          />
        </View>

        {loading && (
          <View className="mt-14 mb-7 space-y-2">
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}

        {(latestResult && !loading) && (
          <View className="mt-14 mb-7 space-y-2">
            <Text className="text-base text-center text-black font-pmedium">
              Latest Result
            </Text>
            {dielectricValue && (
              <View className="w-full h-16 px-4 bg-bhosda-1 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                <Text className="text-sm text-black-100 font-pmedium">
                  Dielectric Value: {dielectricValue}
                </Text>
              </View>
            )}
            {volume !== null && (
              <View className="w-full h-16 px-4 mb-8 bg-bhosda-1 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                <Text className="text-sm text-black-100 font-pmedium">
                  Concentration : {volume.toFixed(2)}
                </Text>
              </View>
            )}
            {/* {latestResult.raw_file_freq && latestResult.raw_file_values && (
              <View style={{ height: 300, flexDirection: 'row' }}>
                <YAxis
                  data={prepareChartData(latestResult.raw_file_freq, latestResult.raw_file_values)}
                  contentInset={{ top: 20, bottom: 20 }}
                  svg={{
                    fill: 'grey',
                    fontSize: 10,
                  }}
                  numberOfTicks={10}
                  formatLabel={(value) => `${value}`}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <LineChart
                    style={{ flex: 1 }}
                    data={prepareChartData(latestResult.raw_file_freq, latestResult.raw_file_values)}
                    svg={{ stroke: '#c43a31' }}
                    contentInset={{ top: 20, bottom: 20 }}
                  >
                    <Grid />
                  </LineChart>
                  <XAxis
                    style={{ marginHorizontal: -10, height: 30 }}
                    data={latestResult.raw_file_freq.slice(2)}
                    formatLabel={(value, index) => index}
                    contentInset={{ left: 10, right: 10 }}
                    svg={{ fontSize: 10, fill: 'grey' }}
                  />
                </View>
              </View>
            )} */}
            {volume !== null && (
              <View className="flex justify-center items-center mt-10">
                <PieChart
                  widthAndHeight={widthAndHeight}
                  series={series}
                  sliceColor={sliceColor}
                  // coverRadius={0.45}
                  coverFill={'#FFF'}
                />
                <View className="mt-4">
                  <View className="flex flex-row items-center">
                    <View className="w-2.5 h-2.5 rounded-full bg-[#3f2305] mr-2" />
                    <Text className="text-base text-center text-black-100 font-pmedium">
                      Melamine : {volume.toFixed(2) * 100}%
                    </Text>
                  </View>
                  <View className="flex flex-row items-center">
                    <View className="w-2.5 h-2.5 rounded-full bg-[#776b5d] mr-2" />
                    <Text className="text-base text-center text-black-100 font-pmedium">
                      Milk : {((1 - volume).toFixed(2))* 100}%
                    </Text>
                  </View>
                </View>
              </View>

            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResultPage;