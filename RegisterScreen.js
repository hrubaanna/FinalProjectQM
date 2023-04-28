import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";

import axios from "axios";

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);
  const [errorName, setErrorName] = React.useState("");
  const [errorText, setErrorText] = React.useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(
        "https://glacial-escarpment-05495.herokuapp.com/userRoutes/register",
        {
          username,
          password,
        }
      );
      if (response.data.success) {
        console.log("Register successful");
        navigation.navigate("Login");
      }
    } catch (error) {
      console.log("Error registering: ", error);
      if (error.response.status == 409) {
        setErrorName("Register Error:");
        setErrorText("Username already exists.");
        setModalVisible(true);
      } else if (error.response.status == 500) {
        setErrorName("Server Error:");
        setErrorText("Please try later.");
        setModalVisible(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      {modalVisible && (
        <Modal animationType="slide">
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontSize: 30 }}> {errorName} </Text>
            <Text style={{ margin: 5, fontSize: 25, padding: 15 }}>
              {errorText}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#007AFF",
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 4,
                marginBottom: 16,
              }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
      <Text style={styles.title}>Register</Text>
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.loginButtonText}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
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
  loginButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  loginButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
});

export default RegisterScreen;
