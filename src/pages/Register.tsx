import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { auth, googleProvider, storage } from "../firebase/firebase.config";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const db = getFirestore();

type RegisterFormInputs = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  photo: FileList;
};

const Register: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    setLoading(true);
    try {
      if (data.password !== data.confirmPassword) {
        alert("Passwords do not match!");
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);

      let photoURL = "";
      if (data.photo && data.photo[0]) {
        const photo = data.photo[0];
        const storageRef = ref(storage, `users/${userCredential.user.uid}/profile.jpg`);
        await uploadBytes(storageRef, photo);
        photoURL = await getDownloadURL(storageRef);
      }

      const userRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userRef, {
        username: data.username,
        email: data.email,
        photoURL,
        createdAt: new Date().toISOString(),
      });

      alert(`Welcome ${data.username}!`);
    } catch (error: any) {
      alert(`Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
  
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
  
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          username: user.displayName || "NewUser",
          email: user.email,
          photoURL: user.photoURL || "",
          createdAt: new Date().toISOString(),
        });
      }
  
      alert(`Welcome ${user.displayName || "User"}!`);
    } catch (error: any) {
      alert(`Google Sign-Up failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Register an Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              {...register("username", { required: "Username is required" })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { required: "Email is required" })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", { required: "Password is required" })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword", { required: "Confirm Password is required" })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
              Profile Photo
            </label>
            <input
              type="file"
              id="photo"
              accept="image/*"
              {...register("photo")}
              className="mt-1 block w-full"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="mt-6">
          <p className="text-center text-gray-500">Or sign up with</p>
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={handleGoogleSignUp}
              className="flex items-center space-x-2 px-4 py-2 border rounded-md hover:bg-gray-100 focus:outline-none">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                alt="Google logo"
                className="w-5 h-5"
              />
              <span>Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;