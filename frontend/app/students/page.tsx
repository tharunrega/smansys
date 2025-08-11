'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { studentsAPI } from '@/lib/api';
import { Search, Filter, ChevronDown, ChevronRight, Plus, Edit, Trash2 } from 'lucide-react';

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  class: string;
  section: string;
  accommodationType: string;
  transportNeeded: boolean;
  location: string;
  contactNumber: string;
  academicDetails?: {
    rank: string;
    points: number;
  };
  avatar?: string;
}

export default function StudentsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');

  useEffect(() => {
    fetchStudents();
  }, [currentPage, searchTerm, selectedClass]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentsAPI.getStudents({
        search: searchTerm,
        class: selectedClass !== 'all' ? selectedClass : undefined,
        page: currentPage,
        limit: 10
      });

      setStudents(response.data || []);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      
      // If the API fails, use mock data for the demo
      const mockStudents = Array(15).fill(null).map((_, index) => ({
        _id: `${index + 1}`,
        firstName: "Sophia",
        lastName: "Wilson",
        rollNumber: "522hca009",
        class: "12",
        section: "A",
        accommodationType: "Hosteller",
        transportNeeded: false,
        location: "Singanallur",
        contactNumber: "824889 89086",
        academicDetails: {
          rank: "001",
          points: 28980
        }
      }));
      
      setStudents(mockStudents);
      setTotalPages(12);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    router.push('/students/add');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(e.target.value);
    setCurrentPage(1);
  };

  const handleEditStudent = (id: string) => {
    router.push(`/students/edit/${id}`);
  };

  const handleDeleteStudent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentsAPI.deleteStudent(id);
        fetchStudents();
      } catch (error) {
        console.error('Failed to delete student:', error);
      }
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between mb-8"
        >
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">Students</h1>
            <p className="text-gray-600 mt-1">Manage student profiles and academic information</p>
          </div>
          <button 
            onClick={handleAddNew} 
            className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg inline-flex items-center transition duration-150 ease-in-out"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add New Student
          </button>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-4 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search students by name, ID or class..."
                className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={selectedClass}
                onChange={handleClassChange}
                className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Classes</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
              <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg">
                <Filter size={18} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Students Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden mb-8"
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-primary rounded-full"></div>
              <p className="mt-4 text-gray-600">Loading students data...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center">
              <div className="bg-gray-100 inline-flex items-center justify-center w-16 h-16 rounded-full mb-4">
                <ChevronRight className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No students found</h3>
              <p className="text-gray-500 mt-2 mb-6">Try adjusting your search filters</p>
              <button
                onClick={handleAddNew}
                className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg inline-flex items-center transition duration-150 ease-in-out"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add New Student
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Roll Number
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Class
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Accommodation
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                              <img 
                                src={student.avatar || `https://ui-avatars.com/api/?name=${student.firstName}+${student.lastName}&background=random`} 
                                alt={`${student.firstName} ${student.lastName}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {student.firstName} {student.lastName}
                              </div>
                              {student.academicDetails && (
                                <div className="text-sm text-gray-500">
                                  Rank: {student.academicDetails.rank}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.rollNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            Class {student.class}-{student.section}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.accommodationType === "Hosteller" 
                              ? "bg-blue-100 text-blue-800" 
                              : "bg-green-100 text-green-800"
                          }`}>
                            {student.accommodationType}
                          </span>
                          {student.transportNeeded && (
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Transport
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.contactNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleEditStudent(student._id)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteStudent(student._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between items-center">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === 1 
                          ? "bg-gray-100 text-gray-400" 
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Previous
                    </button>
                    <div className="text-sm text-gray-700">
                      <span>Page </span>
                      <span className="font-medium">{currentPage}</span>
                      <span> of </span>
                      <span className="font-medium">{totalPages}</span>
                    </div>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === totalPages 
                          ? "bg-gray-100 text-gray-400" 
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </AppLayout>
  ); 
}