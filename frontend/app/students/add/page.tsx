'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Calendar, ChevronLeft } from 'lucide-react';

export default function AddStudentPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male',
    dateOfBirth: '',
    class: '',
    section: '',
    username: '',
    password: '',
    phone: '',
    email: '',
    address: '',
    location: '',
    district: '',
    pincode: '',
    state: '',
    fatherName: '',
    fatherContact: '',
    fatherOccupation: '',
    motherName: '',
    motherContact: '',
    annualIncome: '',
    accommodationType: 'Day Scholler',
    transportNeeded: 'Transport',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'radio') {
      const input = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: input.checked ? input.value : prev[name as keyof typeof prev]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Here you would normally submit the data to your API
      // For now, we'll just simulate a successful submission
      setTimeout(() => {
        setSaving(false);
        router.push('/students');
      }, 1000);
    } catch (error) {
      setSaving(false);
      console.error('Failed to save student:', error);
    }
  };

  const handleCancel = () => {
    router.push('/students');
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      gender: 'Male',
      dateOfBirth: '',
      class: '',
      section: '',
      username: '',
      password: '',
      phone: '',
      email: '',
      address: '',
      location: '',
      district: '',
      pincode: '',
      state: '',
      fatherName: '',
      fatherContact: '',
      fatherOccupation: '',
      motherName: '',
      motherContact: '',
      annualIncome: '',
      accommodationType: 'Day Scholler',
      transportNeeded: 'Transport',
    });
    setSelectedFile(null);
  };

  if (!user) {
    return null;
  }

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Add New Student</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Basic Information */}
            <div className="card">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-medium">Basic Information</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smansys-secondary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="First Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smansys-secondary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === 'Male'}
                        onChange={handleChange}
                        className="w-4 h-4 text-smansys-secondary border-gray-300 rounded focus:ring-smansys-secondary"
                      />
                      <span className="ml-2">Male</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === 'Female'}
                        onChange={handleChange}
                        className="w-4 h-4 text-smansys-secondary border-gray-300 rounded focus:ring-smansys-secondary"
                      />
                      <span className="ml-2">Female</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smansys-secondary focus:border-transparent"
                      placeholder="dd/mm/yyyy"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-2">
                      Class
                    </label>
                    <select
                      id="class"
                      name="class"
                      value={formData.class}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smansys-secondary focus:border-transparent"
                    >
                      <option value="">Select</option>
                      <option value="12">12</option>
                      <option value="11">11</option>
                      <option value="10">10</option>
                    </select>
                  </div>
                  <div className="w-1/2">
                    <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-2">
                      Section
                    </label>
                    <select
                      id="section"
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smansys-secondary focus:border-transparent"
                    >
                      <option value="">Select</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Drop your files to upload</p>
                    <label className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-200 transition">
                      Select files
                      <input type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                    {selectedFile && (
                      <p className="mt-2 text-sm text-gray-600">Selected: {selectedFile.name}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Login/Account Details */}
            <div className="card">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-medium">Login/Account Details</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    User Name
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smansys-secondary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smansys-secondary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-medium">Contact Information</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Contact number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smansys-secondary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smansys-secondary focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    placeholder="Area and Street"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smansys-secondary focus:border-transparent"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smansys-secondary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                    District
                  </label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    placeholder="District"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smansys-secondary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smansys-secondary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smansys-secondary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Parent Details */}
            <div className="card">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-medium">Parent Details</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700 mb-2">
                    Father Name
                  </label>
                  <input
                    type="text"
                    id="fatherName"
                    name="fatherName"
                    placeholder="First Name"
                    value={formData.fatherName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smansys-secondary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="motherName" className="block text-sm font-medium text-gray-700 mb-2">
                    Mother Name
                  </label>
                  <input
                    type="text"
                    id="motherName"
                    name="motherName"
                    placeholder="First Name"
                    value={formData.motherName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smansys-secondary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="fatherContact" className="block text-sm font-medium text-gray-700 mb-2">
                    Father Contact
                  </label>
                  <input
                    type="tel"
                    id="fatherContact"
                    name="fatherContact"
                    placeholder="Contact"
                    value={formData.fatherContact}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smansys-secondary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="motherContact" className="block text-sm font-medium text-gray-700 mb-2">
                    Mother Contact
                  </label>
                  <input
                    type="tel"
                    id="motherContact"
                    name="motherContact"
                    placeholder="Contact"
                    value={formData.motherContact}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smansys-secondary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="fatherOccupation" className="block text-sm font-medium text-gray-700 mb-2">
                    Father Occupation
                  </label>
                  <input
                    type="text"
                    id="fatherOccupation"
                    name="fatherOccupation"
                    placeholder="Ex: Business"
                    value={formData.fatherOccupation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smansys-secondary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="annualIncome" className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Income
                  </label>
                  <input
                    type="number"
                    id="annualIncome"
                    name="annualIncome"
                    placeholder="1,00,000"
                    value={formData.annualIncome}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-smansys-secondary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="card mb-6">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-medium">Additional Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accommodation Type
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className={`flex items-center justify-center px-6 py-3 border ${formData.accommodationType === 'Day Scholler' ? 'border-smansys-secondary bg-blue-50 text-smansys-secondary' : 'border-gray-200 text-gray-700'} rounded-full cursor-pointer transition-colors`}>
                      <input
                        type="radio"
                        name="accommodationType"
                        value="Day Scholler"
                        checked={formData.accommodationType === 'Day Scholler'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span>Day Scholler</span>
                    </label>
                    <label className={`flex items-center justify-center px-6 py-3 border ${formData.accommodationType === 'Hosteller' ? 'border-smansys-secondary bg-blue-50 text-smansys-secondary' : 'border-gray-200 text-gray-700'} rounded-full cursor-pointer transition-colors`}>
                      <input
                        type="radio"
                        name="accommodationType"
                        value="Hosteller"
                        checked={formData.accommodationType === 'Hosteller'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span>Hosteller</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transport
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className={`flex items-center justify-center px-6 py-3 border ${formData.transportNeeded === 'Transport' ? 'border-smansys-secondary bg-blue-50 text-smansys-secondary' : 'border-gray-200 text-gray-700'} rounded-full cursor-pointer transition-colors`}>
                      <input
                        type="radio"
                        name="transportNeeded"
                        value="Transport"
                        checked={formData.transportNeeded === 'Transport'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span>Transport</span>
                    </label>
                    <label className={`flex items-center justify-center px-6 py-3 border ${formData.transportNeeded === 'Non Transport' ? 'border-smansys-secondary bg-blue-50 text-smansys-secondary' : 'border-gray-200 text-gray-700'} rounded-full cursor-pointer transition-colors`}>
                      <input
                        type="radio"
                        name="transportNeeded"
                        value="Non Transport"
                        checked={formData.transportNeeded === 'Non Transport'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span>Non Transport</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-smansys-secondary text-white rounded-lg hover:bg-smansys-secondary/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
