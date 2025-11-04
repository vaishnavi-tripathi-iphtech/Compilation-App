import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FormInput from '../../../components/FormInput';
import StarRating from '../../../components/Rating';
import ModalForm from '../../../components/ ModalForm';
import { AppDispatch } from '../../../store';
import { logout, selectCurrentUser, updateUserProfile } from '../../../store/authSlice';
import { persistor } from '../../../store';

const ProfileSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  username: Yup.string().min(3).required('Username is required'),
});

const FeedbackSchema = Yup.object().shape({
  voiceRating: Yup.number().min(1, 'Rating is required').required(),
  videoRating: Yup.number().min(1, 'Rating is required').required(),
  suggestion: Yup.string(),
});

const ProfileScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector(selectCurrentUser);

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isFeedbackModalVisible, setFeedbackModalVisible] = useState(false);

  const handleUpdateProfile = (values: any) => {
    dispatch(updateUserProfile({ ...values, id: currentUser.id }));
   Alert.alert('Profile Updated!');
    setEditModalVisible(false); //close modal on submit
  };

  const handleFeedbackSubmit = (values: any, { resetForm }) => {
    console.log('Feedback Submitted:', values);
    Alert.alert('Thank You!', 'Your feedback has been submitted.', [
        { text: 'OK', onPress: () => {
            resetForm();
            setFeedbackModalVisible(false); //close modal on submit
        }}
    ]);
  };
  
  const handleLogout = async () => {
    dispatch(logout());
    await persistor.purge();
  };

  if (!currentUser) return <Text style={styles.loadingText}>Loading Profile...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Full Name:</Text>
        <Text style={styles.infoValue}>{currentUser.firstName} {currentUser.lastName}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Username:</Text>
        <Text style={styles.infoValue}>@{currentUser.username}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoValue}>{currentUser.email}</Text>
      </View>
       <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Phone:</Text>
        <Text style={styles.infoValue}>{currentUser.phone}</Text>
      </View>
      
      <TouchableOpacity style={styles.actionButton} onPress={() => setEditModalVisible(true)}>
        <Text style={styles.actionButtonText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={() => setFeedbackModalVisible(true)}>
        <Text style={styles.actionButtonText}>Give Feedback</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.actionButtonText}>Log Out</Text>
      </TouchableOpacity>
  

      <ModalForm 
        visible={isEditModalVisible} 
        onClose={() => setEditModalVisible(false)}
        title="Edit Profile"
      >
        <Formik
          initialValues={{
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            username: currentUser.username,
          }}
          validationSchema={ProfileSchema}
          onSubmit={handleUpdateProfile}
          enableReinitialize
        >
          {(formik) => (
            <>
              <FormInput formik={formik} fieldName="firstName" label="First Name" />
              <FormInput formik={formik} fieldName="lastName" label="Last Name" />
              <FormInput formik={formik} fieldName="username" label="Username" />
              <TouchableOpacity style= { styles.actionButton} onPress={() => formik.handleSubmit()}>
                    <Text style= {styles.actionButtonText}>
                      Submit
                    </Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </ModalForm>


      <ModalForm 
        visible={isFeedbackModalVisible} 
        onClose={() => setFeedbackModalVisible(false)}
        title="Call Feedback"
      >
        <Formik
          initialValues={{ voiceRating: 0, videoRating: 0, suggestion: '' }}
          validationSchema={FeedbackSchema}
          onSubmit={handleFeedbackSubmit}
        >
          {(formik) => (
            <>
              <View style={styles.ratingSection}>
                <Text style={styles.ratingLabel}>Voice Quality:</Text>
                <StarRating 
                  rating={formik.values.voiceRating}
                  onRate={(rate) => formik.setFieldValue('voiceRating', rate)}
                />
              </View>
              <View style={styles.ratingSection}>
                <Text style={styles.ratingLabel}>Video Quality:</Text>
                <StarRating 
                  rating={formik.values.videoRating}
                  onRate={(rate) => formik.setFieldValue('videoRating', rate)}
                />
              </View>
              <FormInput
                formik={formik}
                fieldName="suggestion"
                label="Suggestions:"
                multiline
                numberOfLines={4}
              />
                  <TouchableOpacity style= { styles.actionButton} onPress={() => formik.handleSubmit()}>
                    <Text style= {styles.actionButtonText}>
                      Submit
                    </Text>
                  </TouchableOpacity>
            </>
          )}
        </Formik>
      </ModalForm>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
       padding: 20, 
       paddingBottom: 50 
      },
    loadingText: { 
      flex: 1, 
      textAlign: 'center', 
      textAlignVertical: 'center', 
      fontSize: 18 },
    title: { 
      fontSize: 28, 
      fontWeight: 'bold', 
      marginBottom: 30, 
      textAlign: 'center' 
    },
    infoContainer: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      marginBottom: 15, 
      paddingVertical: 10, 
      borderBottomWidth: 1, 
      borderBottomColor: '#cbcbcbff' 
    },
    infoLabel: { 
      fontSize: 16, 
      color: '#666' 
    },
    infoValue: { 
      fontSize: 16, 
      fontWeight: '500' 
    },
    actionButton: { 
      backgroundColor: '#bababaff', 
      padding: 15, 
      borderRadius: 10, 
      alignItems: 'center', 
      marginTop: 15 
    },
    actionButtonText: { 
      color: 'white', 
      fontSize: 16, 
      fontWeight: 'bold' 
    },
    logoutButton: { 
      marginTop: 15,
      backgroundColor: '#bababaff', 
      padding: 15, 
      borderRadius: 10, 
      alignItems: 'center'
    },
    ratingSection: { 
      marginBottom: 20 
    },
    ratingLabel: { 
      fontSize: 16, 
      marginBottom: 10 
    },
});

export default ProfileScreen;