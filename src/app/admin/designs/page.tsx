"use client"

import { useState } from "react";
import { PenTool, Lightbulb, Plus, X, Upload, Star, Save, ArrowLeft, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface FormData {
  beforeImage: File | null;
  afterImage: File | null;
  ideaImage: File | null;
  personImage: File | null;
  personName: string;
  personDesignation: string;
  rating: number;
  testimonial: string;
}

interface DataItem {
  id: string;
  beforeImage?: string;
  afterImage?: string;
  ideaImage?: string;
  personImage?: string;
  personName: string;
  personDesignation: string;
  rating: number;
  testimonial: string;
}

export default function DesignAdminPage() {
  const [activePage, setActivePage] = useState<string | null>(null);
  const [items, setItems] = useState<Record<string, string[]>>({
    "Our Creations": ["Bedroom", "Living Room", "False Ceiling"],
    "Our Ideas": ["Modern Minimalist", "Rustic Charm"],
  });
  const [newItem, setNewItem] = useState<string>("");
  const [showAddInput, setShowAddInput] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<{category: string, item: string} | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    beforeImage: null,
    afterImage: null,
    ideaImage: null,
    personImage: null,
    personName: "",
    personDesignation: "",
    rating: 5,
    testimonial: ""
  });

  // Mock data - in real app, this would come from your database
  const [mockData, setMockData] = useState<Record<string, DataItem[]>>({
    "Bedroom": [
      {
        id: "1",
        beforeImage: "bedroom-before-1.jpg",
        afterImage: "bedroom-after-1.jpg",
        personImage: "person-1.jpg",
        personName: "John Smith",
        personDesignation: "Homeowner",
        rating: 5,
        testimonial: "Amazing transformation of my bedroom!"
      },
      {
        id: "2",
        beforeImage: "bedroom-before-2.jpg",
        afterImage: "bedroom-after-2.jpg",
        personImage: "person-2.jpg",
        personName: "Sarah Johnson",
        personDesignation: "Interior Enthusiast",
        rating: 4,
        testimonial: "Love the new modern look!"
      }
    ],
    "Living Room": [
      {
        id: "3",
        beforeImage: "living-before-1.jpg",
        afterImage: "living-after-1.jpg",
        personImage: "person-3.jpg",
        personName: "Mike Brown",
        personDesignation: "Architect",
        rating: 5,
        testimonial: "Perfect space for family gatherings!"
      }
    ],
    "False Ceiling": [],
    "Modern Minimalist": [
      {
        id: "4",
        ideaImage: "minimalist-idea-1.jpg",
        personImage: "designer-1.jpg",
        personName: "Emma Wilson",
        personDesignation: "Senior Interior Designer",
        rating: 5,
        testimonial: "Clean lines and functional beauty define this approach."
      }
    ],
    "Rustic Charm": [
      {
        id: "5",
        ideaImage: "rustic-idea-1.jpg",
        personImage: "designer-2.jpg",
        personName: "David Chen",
        personDesignation: "Creative Director",
        rating: 4,
        testimonial: "Bringing warmth and character to every space."
      }
    ]
  });

  const handlePageClick = (pageName: string) => {
    setActivePage((prev) => (prev === pageName ? null : pageName));
    setNewItem("");
    setShowAddInput(false);
    setSelectedItem(null);
    setShowAddForm(false);
  };

  const handleOptionClick = (pageName: string, option: string) => {
    setSelectedItem({category: pageName, item: option});
    setShowAddForm(false);
  };

  const handleAddItem = (pageName: string) => {
    if (newItem.trim() === "") return;
    setItems((prev) => ({
      ...prev,
      [pageName]: [...(prev[pageName] || []), newItem],
    }));
    // Initialize empty data array for new item
    setMockData(prev => ({
      ...prev,
      [newItem]: []
    }));
    setNewItem("");
    setShowAddInput(false);
  };

  const handleDeleteItem = (pageName: string, itemToDelete: string) => {
    setItems((prev) => ({
      ...prev,
      [pageName]: prev[pageName].filter(item => item !== itemToDelete),
    }));
    // Also remove from mock data
    setMockData(prev => {
      const newData = { ...prev };
      delete newData[itemToDelete];
      return newData;
    });
  };

  const handlePlusClick = () => {
    setShowAddInput(true);
  };

  const handleCancelAdd = () => {
    setShowAddInput(false);
    setNewItem("");
  };

  const handleKeyPress = (e: React.KeyboardEvent, pageName: string) => {
    if (e.key === 'Enter') {
      handleAddItem(pageName);
    } else if (e.key === 'Escape') {
      handleCancelAdd();
    }
  };

  const handleFileChange = (field: 'beforeImage' | 'afterImage' | 'ideaImage' | 'personImage', file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitForm = () => {
    if (!selectedItem) return;
    
    const newDataItem: DataItem = {
      id: Date.now().toString(),
      personName: formData.personName,
      personDesignation: formData.personDesignation,
      rating: formData.rating,
      testimonial: formData.testimonial,
      personImage: formData.personImage?.name || ""
    };

    if (selectedItem.category === "Our Ideas") {
      newDataItem.ideaImage = formData.ideaImage?.name || "";
    } else {
      newDataItem.beforeImage = formData.beforeImage?.name || "";
      newDataItem.afterImage = formData.afterImage?.name || "";
    }

    setMockData(prev => ({
      ...prev,
      [selectedItem.item]: [...(prev[selectedItem.item] || []), newDataItem]
    }));

    // Reset form
    setFormData({
      beforeImage: null,
      afterImage: null,
      ideaImage: null,
      personImage: null,
      personName: "",
      personDesignation: "",
      rating: 0,
      testimonial: ""
    });

    setShowAddForm(false);
    toast.success(`Data added successfully for ${selectedItem.item}!`);
  };

  const handleDeleteData = (itemName: string, dataId: string) => {
    setMockData(prev => ({
      ...prev,
      [itemName]: prev[itemName]?.filter(item => item.id !== dataId) || []
    }));
  };

  const handleAddNewData = () => {
    setShowAddForm(true);
    // Reset form data
    setFormData({
      beforeImage: null,
      afterImage: null,
      ideaImage: null,
      personImage: null,
      personName: "",
      personDesignation: "",
      rating: 5,
      testimonial: ""
    });
  };

  const getPersonLabel = (category: string) => {
    return category === "Our Ideas" ? "Designer" : "Consumer";
  };

  const designPages = [
    {
      name: "Our Creations",
      icon: <PenTool size={32} />,
    },
    {
      name: "Our Ideas",
      icon: <Lightbulb size={32} />,
    },
  ];

  const FileUploadField = ({ 
    label, 
    file, 
    onChange, 
    accept = "image/*" 
  }: { 
    label: string; 
    file: File | null; 
    onChange: (file: File | null) => void;
    accept?: string;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors">
        <input
          type="file"
          accept={accept}
          onChange={(e) => onChange(e.target.files?.[0] || null)}
          className="hidden"
          id={label.replace(/\s+/g, '-').toLowerCase()}
        />
        <label 
          htmlFor={label.replace(/\s+/g, '-').toLowerCase()}
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <Upload size={24} className="text-gray-400" />
          <span className="text-sm text-gray-600">
            {file ? file.name : `Click to upload ${label.toLowerCase()}`}
          </span>
        </label>
      </div>
    </div>
  );

  const StarRating = ({ rating, onChange }: { rating: number; onChange: (rating: number) => void }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          className={`transition-colors ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          <Star size={24} fill={star <= rating ? 'currentColor' : 'none'} />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
    </div>
  );

  const DataTable = ({ data, category, itemName }: { data: DataItem[], category: string, itemName: string }) => {
    const isIdeasCategory = category === "Our Ideas";
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              {!isIdeasCategory && (
                <>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Before</th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">After</th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Consumer Name</th>
                </>
              )}
              {isIdeasCategory && (
                <>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Idea Image</th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Designer Name</th>
                </>
              )}
              <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Rating</th>
              <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">View</th>
              <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Delete</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td 
                  colSpan={isIdeasCategory ? 5 : 6} 
                  className="border border-gray-200 px-4 py-8 text-center text-gray-500"
                >
                  No data available. Click the + button to add new data.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {!isIdeasCategory && (
                    <>
                      <td className="border border-gray-200 px-4 py-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500">
                          {item.beforeImage || 'No image'}
                        </div>
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500">
                          {item.afterImage || 'No image'}
                        </div>
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{item.personName}</p>
                          <p className="text-sm text-gray-500">{item.personDesignation}</p>
                        </div>
                      </td>
                    </>
                  )}
                  {isIdeasCategory && (
                    <>
                      <td className="border border-gray-200 px-4 py-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500">
                          {item.ideaImage || 'No image'}
                        </div>
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{item.personName}</p>
                          <p className="text-sm text-gray-500">{item.personDesignation}</p>
                        </div>
                      </td>
                    </>
                  )}
                  <td className="border border-gray-200 px-4 py-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                        />
                      ))}
                      <span className="ml-1 text-sm text-gray-600">({item.rating})</span>
                    </div>
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    <button
                      onClick={() => toast.info(`Viewing details for: ${item.personName}\n\nTestimonial: ${item.testimonial}`)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    <button
                      onClick={() => handleDeleteData(itemName, item.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-gray-50">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Manage Designs</h1>

      {!showAddForm ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {designPages.map((page) => (
              <div
                key={page.name}
                className={`cursor-pointer bg-white p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-xl ${
                  activePage === page.name ? "ring-2 ring-green-500" : ""
                }`}
                onClick={() => handlePageClick(page.name)}
              >
                <div className="text-green-600 mb-3 sm:mb-4">{page.icon}</div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 text-center">
                  {page.name}
                </h2>
              </div>
            ))}
          </div>

          {/* Inline Expandable Panel with Carousel */}
          {activePage && (
            <div className="mt-6 sm:mt-8 bg-white rounded-2xl shadow-lg p-4 sm:p-6 overflow-hidden animate-in fade-in slide-in-from-top duration-300">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{activePage}</h2>
                <button
                  onClick={() => setActivePage(null)}
                  className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl p-1"
                >
                  ✕
                </button>
              </div>

              {/* Carousel Container */}
              <div className="relative mb-6">
                <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                  {/* Existing Items */}
                  {items[activePage]?.map((option, index) => (
                    <div
                      key={option}
                      className={`cursor-pointer p-3 sm:p-4 rounded-xl flex items-center justify-between font-medium transition-all duration-200 whitespace-nowrap min-w-[100px] sm:min-w-[120px] flex-shrink-0 group relative text-sm sm:text-base hover:scale-103 ${
                        selectedItem?.item === option 
                          ? 'bg-green-100 text-green-800 ' 
                          : 'bg-gray-100 text-gray-700 hover:bg-green-50'
                      }`}
                      onClick={() => handleOptionClick(activePage, option)}
                    >
                      <span className="mr-6 sm:mr-8">{option}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(activePage, option);
                        }}
                        className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 sm:p-1 transition-all duration-200 flex items-center justify-center"
                      >
                        <X size={10} className="sm:hidden" />
                        <X size={12} className="hidden sm:block" />
                      </button>
                    </div>
                  ))}

                  {/* Add Input Field */}
                  {showAddInput && (
                    <div className="flex items-center gap-2 flex-shrink-0 animate-in fade-in slide-in-from-right duration-300">
                      <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e, activePage)}
                        placeholder="New item"
                        className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 w-32 sm:w-40 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => handleAddItem(activePage)}
                        className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-2 sm:px-3 py-2 sm:py-3 flex items-center justify-center transition-colors"
                      >
                        <Plus size={14} className="sm:hidden" />
                        <Plus size={16} className="hidden sm:block" />
                      </button>
                      <button
                        onClick={handleCancelAdd}
                        className="bg-gray-400 hover:bg-gray-500 text-white rounded-lg px-2 sm:px-3 py-2 sm:py-3 flex items-center justify-center transition-colors"
                      >
                        <X size={14} className="sm:hidden" />
                        <X size={16} className="hidden sm:block" />
                      </button>
                    </div>
                  )}

                  {/* Plus Button */}
                  {!showAddInput && (
                    <button
                      onClick={handlePlusClick}
                      className="bg-green-500 hover:bg-green-600 text-white rounded-xl p-3 sm:p-4 flex items-center justify-center flex-shrink-0 min-w-[50px] sm:min-w-[60px] transition-all duration-200 hover:scale-105"
                    >
                      <Plus size={16} className="sm:hidden" />
                      <Plus size={20} className="hidden sm:block" />
                    </button>
                  )}
                </div>
              </div>

              {/* Data Table Section */}
              {selectedItem && (
                <div className="border-t border-gray-200 pt-6 animate-in fade-in slide-in-from-bottom duration-300">
                  {/* Table Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {selectedItem.item} Data
                    </h3>
                    <button
                      onClick={handleAddNewData}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
                    >
                      <Plus size={16} />
                      Add New Data
                    </button>
                  </div>

                  {/* Data Table */}
                  <DataTable 
                    data={mockData[selectedItem.item] || []}
                    category={selectedItem.category}
                    itemName={selectedItem.item}
                  />
                </div>
              )}

              {/* Instructions */}
              <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 text-center">
                {!selectedItem 
                  ? "Click on any item to view its data" 
                  : ""}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Form View */
        <div className="bg-white rounded-2xl shadow-lg p-6 animate-in fade-in slide-in-from-right duration-300">
          {/* Form Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-2"
              >
                <ArrowLeft size={20} />
                Back to {selectedItem?.item} List
              </button>
              <h2 className="text-2xl font-bold text-gray-800">
                Add New Data - {selectedItem?.item}
              </h2>
            </div>
          </div>

          {/* Form Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Images */}
            <div className="space-y-6">
              {selectedItem?.category === "Our Ideas" ? (
                <FileUploadField
                  label="Idea Image"
                  file={formData.ideaImage}
                  onChange={(file) => handleFileChange('ideaImage', file)}
                />
              ) : (
                <>
                  <FileUploadField
                    label="Before Image"
                    file={formData.beforeImage}
                    onChange={(file) => handleFileChange('beforeImage', file)}
                  />
                  
                  <FileUploadField
                    label="After Image"
                    file={formData.afterImage}
                    onChange={(file) => handleFileChange('afterImage', file)}
                  />
                </>
              )}
              
              <FileUploadField
                label={`${getPersonLabel(selectedItem?.category || "")} Profile Picture`}
                file={formData.personImage}
                onChange={(file) => handleFileChange('personImage', file)}
              />
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getPersonLabel(selectedItem?.category || "")} Name
                </label>
                <input
                  type="text"
                  value={formData.personName}
                  onChange={(e) => handleInputChange('personName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder={`Enter ${getPersonLabel(selectedItem?.category || "").toLowerCase()} name`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getPersonLabel(selectedItem?.category || "")} Designation
                </label>
                <input
                  type="text"
                  value={formData.personDesignation}
                  onChange={(e) => handleInputChange('personDesignation', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder={`Enter ${getPersonLabel(selectedItem?.category || "").toLowerCase()} designation`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Rating
                </label>
                <StarRating
                  rating={formData.rating}
                  onChange={(rating) => handleInputChange('rating', rating)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Testimonial
                </label>
                <textarea
                  value={formData.testimonial}
                  onChange={(e) => handleInputChange('testimonial', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                  placeholder="Enter testimonial or feedback..."
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSubmitForm}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save size={20} />
              Save Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}