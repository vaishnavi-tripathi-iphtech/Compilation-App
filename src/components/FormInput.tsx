import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { FormikProps } from 'formik';

interface FormInputProps {
  formik: FormikProps<any>;
  fieldName: string;
  label: string;
  [x: string]: any;
}

const FormInput = ({ formik, fieldName, label, ...props }: FormInputProps) => {
  const isError = formik.touched[fieldName] && formik.errors[fieldName];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, isError && styles.errorInput]}
        onChangeText={formik.handleChange(fieldName)}
        onBlur={formik.handleBlur(fieldName)}
        value={formik.values[fieldName]}
        {...props}
      />
      {isError && <Text style={styles.errorText}>{formik.errors[fieldName] as string}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
    container: { 
        width: '100%', 
        marginBottom: 15,
     },
    label: { 
        marginBottom: 5, 
        fontSize: 14, 
        color: '#333' 
    },
    input: { 
        borderWidth: 1, 
        borderColor: '#ccc', 
        borderRadius: 8, 
        padding: 12, 
        fontSize: 16
     },
    errorInput: { 
        borderColor: 'red'
     },
    errorText: { 
        color: 'red', 
        fontSize: 12, 
        marginTop: 4 
    },
});

export default FormInput;