import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import axios from "axios";

/***
 * The Login Screen
 * This screen allows the user to login to their account
 * or navigate to the register screen
 */

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);
  const [errorName, setErrorName] = React.useState("");
  const [errorText, setErrorText] = React.useState("");

  const handleLogin = async () => {
    if (username === "" || password === "") {
      setErrorName("Login Error:");
      setErrorText("Username and password cannot be empty.");
      setModalVisible(true);
      return;
    }
    try {
      const response = await axios.post(
        "https://glacial-escarpment-05495.herokuapp.com/userRoutes/login",
        {
          username,
          password,
        }
      );
      if (response.data.success) {
        console.log("Login successful");
        navigation.navigate("Home", { username: username });
      }
    } catch (error) {
      console.log("Error logging in: ", error);
      if (error.response.status === 503) {
        setErrorName("Server Error:");
        setErrorText("Please try again later.");
        setModalVisible(true);
      } else if (error.response.status === 404) {
        setErrorName("Login Error:");
        setErrorText("Username not found.");
        setModalVisible(true);
      } else if (error.response.status === 400) {
        setErrorName("Login Error:");
        setErrorText("Incorrect password.");
        setModalVisible(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      {modalVisible && (
        <Modal animationType="slide">
          <View style={styles.popup}>
            <Text style={{ fontSize: 30 }}> {errorName} </Text>
            <Text style={{ margin: 5, fontSize: 25, padding: 15 }}>
              {errorText}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const ErrorComp = ({ errorName, errorText }) => {
  return (
    <Modal animationType="slide">
      <View style={styles.popup}>
        <Text style={{ fontSize: 30 }}> {errorName} </Text>
        <Text style={{ margin: 5, fontSize: 25, padding: 15 }}>
          {errorText}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  registerButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  registerButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
  popup: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoginScreen;
