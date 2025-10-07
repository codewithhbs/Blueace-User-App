import AsyncStorage from "@react-native-async-storage/async-storage";

async function save(key, value) {
  try {
    const data = JSON.stringify(value);
    await AsyncStorage.setItem(key, data);
    console.log("Data saved successfully");
  } catch (error) {
    console.error("Error saving data:", error);
  }
}

async function getValueFor(key) {
  try {
    const result = await AsyncStorage.getItem(key);
    return result != null ? JSON.parse(result) : null;
  } catch (error) {
    console.error("Error retrieving data:", error);
    return null;
  }
}
async function clearStroge() {
  console.log("object")
  await AsyncStorage.clear();
}

export { save, getValueFor ,clearStroge};
