import {
  isClerkAPIResponseError,
  useSignIn,
  useSignUp,
} from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

const singInSchema = z.object({
  emailAddress: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
type signInForm = z.infer<typeof singInSchema>;

const SignIn = () => {
  const { isLoaded: isLoadedSignUp, signUp } = useSignUp();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<signInForm>({
    resolver: zodResolver(singInSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
    },
  });

  const onSubmit = async (data: signInForm) => {
    if (!isLoaded) return;
    try {
      const signInAttempt = await signIn.create({
        identifier: data.emailAddress,
        password: data.password,
      });
      console.log("🚀 ~ onSubmit ~ signInAttempt:", signInAttempt);
      if (signInAttempt.status !== "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.dismissTo("/(tabs)/profile");
      } else {
        console.log(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (error) {
      console.log(error);
      if (isClerkAPIResponseError(error)) {
        const err = error.errors;
        if (err[0]?.code === "form_identifier_not_found") {
          console.log(`Error ${err[0]?.code}: ${err[0]?.longMessage}`);
          createAccount(data);
        } else {
          Alert.alert("Sign In Error", `${err[0]?.longMessage}`);
        }
      }
    }
  };
  const createAccount = async (data: signInForm) => {
    if (!isLoadedSignUp) return;
    try {
      await signUp.create({
        emailAddress: data.emailAddress,
        password: data.password,
      });
      router.dismissTo("/(tabs)/profile");
      Alert.alert("Success", "Check your email to verify your account.");
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
      if (isClerkAPIResponseError(error)) {
        const err = error?.errors[0];
        console.log("🚀 ~ createAccount ~ err:", err);

        if (err.code === "form_password_pwned") {
          Alert.alert(
            "Weak Password",
            "This password has appeared in a data breach. Please choose a stronger password."
          );
          return;
        }

        Alert.alert("Sign Up Error", err.longMessage);
      }
    }
  };
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="p-4">
        <Text className="text-2xl font-bold mb-2">
          Sign in or create account
        </Text>
        <Text className="font-medium text-base mb-2">
          Enter email or mobile number
        </Text>
        <Controller
          control={control}
          name="emailAddress"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Mobile number or email"
              keyboardType="email-address"
              autoCapitalize="none"
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white"
            />
          )}
        />
        {errors.emailAddress && (
          <Text className="text-red-500 mb-2">
            {errors.emailAddress.message}
          </Text>
        )}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter your password"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={!showPassword}
              textContentType="password"
              className="border border-gray-300 rounded-md px-3 py-2 mb-2 bg-white"
            />
          )}
        />
        {errors.password && (
          <Text className="text-red-500 mb-2">{errors.password.message}</Text>
        )}
        <TouchableOpacity
          className="flex-row items-center mb-4"
          onPress={() => setShowPassword((prev) => !prev)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: showPassword }}
          testID="show-password-checkbox"
        >
          <View
            className={`w-5 h-5 mr-2 border border-gray-400   ${showPassword ? "bg-green-100 border-green-600" : "bg-white"} items-center justify-center rounded-border`}
          >
            {showPassword && <View className="w-3 h-3 bg-green-600 rounded" />}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="bg-yellow-400 rounded-full py-3 items-center mb-4"
        >
          <Text className="text-lg font-medium text-black">Sign In</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
