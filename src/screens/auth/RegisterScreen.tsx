import React, { useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Yup from "yup";
import FormInput from "../../components/FormInput";
import { AppDispatch, RootState } from "../../store";
import { registerUser, clearError } from "../../store/authSlice";

// Validation Schema
const RegisterSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  username: Yup.string()
    .min(5, "Username is too short")
    .required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Must be a valid 10-digit phone number")
    .required("Phone is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least 1 lower case letter")
    .matches(/[A-Z]/, "Password must contain at least 1 upper case letter")
    .matches(/[0-9]/, "Password must contain at least 1 number")
    .matches(/[^A-Za-z0-9]/, "Password must contain at least 1 special character")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const RegisterScreen = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleRegister = async (
    values: any,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    const { confirmPassword, ...userData } = values;
    try {
      await dispatch(registerUser(userData)).unwrap();
      Alert.alert("Success", "Registration successful! Please log in.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (e) {
      // Error handled by slice
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={RegisterSchema}
        onSubmit={handleRegister}
      >
        {(formik) => (
          <View style={styles.formContainer}>
            <FormInput
              formik={formik}
              style={styles.input}
              fieldName="firstName"
              label="First Name"
            />

            <FormInput
              formik={formik}
              style={styles.input}
              fieldName="lastName"
              label="Last Name"
            />

            <FormInput
              formik={formik}
              style={styles.input}
              fieldName="username"
              label="Username"
              autoCapitalize="none"
            />

            <FormInput
              formik={formik}
              style={styles.input}
              fieldName="email"
              label="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <FormInput
              formik={formik}
              style={styles.input}
              fieldName="phone"
              label="Phone Number"
              keyboardType="phone-pad"
            />

            <FormInput
              formik={formik}
              style={styles.input}
              fieldName="password"
              label="Password"
              secureTextEntry
            />

            <FormInput
              formik={formik}
              style={styles.input}
              fieldName="confirmPassword"
              label="Confirm Password"
              secureTextEntry
            />

            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator color="#007bff" />
              ) : (
                <TouchableOpacity
                  style={[
                    styles.registerButton,
                    !formik.isValid && { opacity: 0.5 },
                  ]}
                  onPress={() => formik.handleSubmit()}
                  disabled={!formik.isValid}
                >
                  <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.logInContainer}>
              <Text style={styles.logInText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.logInLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#111827",
  },
  formContainer: {
    width: "100%",
  },
  input: {
    width: "100%",
    backgroundColor: "#fcfcfcff",
    borderWidth: 1,
    borderColor: "#fcfcfcff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
    marginBottom: 14,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  registerButton: {
    backgroundColor: "#008be7ff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  registerButtonText: {
    color: "#ffffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  logInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 30
  },
  logInText: {
    fontSize: 15,
    color: "#6B7280",
  },
  logInLink: {
    fontSize: 15,
    color: "#007bff",
    fontWeight: "600",
  },
});

export default RegisterScreen;