"use client";

import React, { useState } from "react";
import {
  Package,
  Store,
  Building2,
  MapPin,
  Phone,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleOnboarding } from "@/actions/NextServerActions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";


const OnboardingForm = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    whatsappNumber: "",
    locations: [{ name: "", address: "" }],
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {toast} = useToast();

  const businessTypes = [
    { value: "pharmacy", label: "Pharmacy" },
    { value: "supermarket", label: "Supermarket" },
    { value: "boutique", label: "Boutique" },
    { value: "electronics", label: "Electronics" },
    { value: "other", label: "Other" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleLocationChange = (index, field, value) => {
    const newLocations = [...formData.locations];
    newLocations[index] = { ...newLocations[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      locations: newLocations,
    }));
    if (errors.locations?.[index]?.[field]) {
      const newErrors = { ...errors };
      if (newErrors.locations) {
        newErrors.locations[index] = {
          ...newErrors.locations[index],
          [field]: undefined,
        };
      }
      setErrors(newErrors);
    }
  };

  const addLocation = () => {
    setFormData((prev) => ({
      ...prev,
      locations: [...prev.locations, { name: "", address: "" }],
    }));
  };

  const removeLocation = (index) => {
    if (formData.locations.length > 1) {
      setFormData((prev) => ({
        ...prev,
        locations: prev.locations.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newErrors = {};
    let hasErrors = false;

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
      hasErrors = true;
    }

    const locationErrors = formData.locations.map((location) => {
      const locErrors = {};
      if (!location.name.trim()) {
        locErrors.name = "Location name is required";
        hasErrors = true;
      }
      if (!location.address.trim()) {
        locErrors.address = "Location address is required";
        hasErrors = true;
      }
      return locErrors;
    });

    if (hasErrors) {
      newErrors.locations = locationErrors;
      setErrors(newErrors);
      return;
    }

    try {
      await handleOnboarding(formData);
      router.push("/site/dashboard");
      toast({
        title: "Onboarding Successful",
        description: "Your business has been onboarded successfully"
      })
    } catch (error) {
      console.error("Failed to onboard User: ", error);
      toast({
        title: "Failed to Onboard Business",
        description: "The onboarding process has failed",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Package className="h-12 w-12 text-blue-600" />
            <span className="ml-3 text-3xl font-bold text-gray-900">
              Inventrack
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Welcome to Inventrack
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Let&apos;s set up your business profile
          </p>
        </div>

        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 p-8">
            <div>
              <label
                htmlFor="businessName"
                className="block text-sm font-medium text-gray-700"
              >
                Business Name <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Store className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  placeholder="e.g. Blessing Pharmacy"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.businessName ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
              {errors.businessName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.businessName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="businessType"
                className="block text-sm font-medium text-gray-700"
              >
                Business Type
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="businessType"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a business type</option>
                  {businessTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="whatsappNumber"
                className="block text-sm font-medium text-gray-700"
              >
                WhatsApp Number
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="whatsappNumber"
                  name="whatsappNumber"
                  placeholder="e.g. +1234567890"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Locations <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={addLocation}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Location
                </button>
              </div>

              {formData.locations.map((location, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg relative">
                  {formData.locations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLocation(index)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Location Name <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Store className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Main Branch"
                        value={location.name}
                        onChange={(e) =>
                          handleLocationChange(index, "name", e.target.value)
                        }
                        className={`block w-full pl-10 pr-3 py-2 border ${errors.locations?.[index]?.name ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                      />
                    </div>
                    {errors.locations?.[index]?.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.locations[index].name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Location Address <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 pt-2 pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        rows={3}
                        placeholder="Enter location address"
                        value={location.address}
                        onChange={(e) =>
                          handleLocationChange(index, "address", e.target.value)
                        }
                        className={`block w-full pl-10 pr-3 py-2 border ${errors.locations?.[index]?.address ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                      />
                    </div>
                    {errors.locations?.[index]?.address && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.locations[index].address}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button
                disabled={isLoading}
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Complete Setup"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
