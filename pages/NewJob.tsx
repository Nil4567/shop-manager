import React, { useState, useEffect } from 'react';
import { Job, JobStage, Customer } from '../types';
import { EMPLOYEES } from '../constants';
import { getCustomers, saveOrUpdateCustomer } from '../services/storageService';

interface NewJobProps {
  onSubmit: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'history'>) => void;
  onCancel: () => void;
}

const NewJob: React.FC<NewJobProps> = ({ onSubmit, onCancel }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    customerContact: '',
    customerEmail: '',
    description: '',
    type: 'Print',
    priority: 'Normal',
    price: 0,
    assignedTo: EMPLOYEES[0] // Default to Counter (Alice)
  });

  useEffect(() => {
    setCustomers(getCustomers());
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData({ ...formData, customerName: val });
    
    if (val.length > 0) {
      const matches = customers.filter(c => c.name.toLowerCase().includes(val.toLowerCase()));
      setFilteredCustomers(matches);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectCustomer = (customer: Customer) => {
    setFormData({
      ...formData,
      customerName: customer.name,
      customerContact: customer.phone,
      customerEmail: customer.email
    });
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save customer info to DB
    saveOrUpdateCustomer(formData.customerName, formData.customerContact, formData.customerEmail);

    onSubmit({
      ...formData,
      type: formData.type as any,
      priority: formData.priority as any,
      currentStage: JobStage.COUNTER, // Starts at counter
      assignedTo: formData.assignedTo,
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden">
      <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600">
        <h2 className="text-xl font-bold text-white">New Job Entry</h2>
        <p className="text-indigo-100 text-sm mt-1">Enter job details and customer information</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        
        {/* Customer Section */}
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
          <h3 className="text-sm uppercase tracking-wide text-slate-500 font-semibold mb-4">Customer Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <input
                required
                type="text"
                autoComplete="off"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="Search or Enter Name"
                value={formData.customerName}
                onChange={handleNameChange}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              {showSuggestions && filteredCustomers.length > 0 && (
                <div className="absolute z-10 w-full max-w-[50%] bg-white border border-gray-200 rounded-lg shadow-xl mt-1 max-h-40 overflow-y-auto">
                  {filteredCustomers.map(c => (
                    <div 
                      key={c.id} 
                      className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm"
                      onClick={() => selectCustomer(c)}
                    >
                      <div className="font-medium text-gray-800">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.phone}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
               <input
                 required
                 type="tel"
                 className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                 placeholder="Mobile Number"
                 value={formData.customerContact}
                 onChange={e => setFormData({...formData, customerContact: e.target.value})}
               />
            </div>
            <div className="md:col-span-2">
               <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
               <input
                 type="email"
                 className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                 placeholder="customer@email.com"
                 value={formData.customerEmail}
                 onChange={e => setFormData({...formData, customerEmail: e.target.value})}
               />
            </div>
          </div>
        </div>

        {/* Job Section */}
        <div>
          <h3 className="text-sm uppercase tracking-wide text-slate-500 font-semibold mb-4">Job Specification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
               <select
                 className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                 value={formData.type}
                 onChange={e => setFormData({...formData, type: e.target.value})}
               >
                 <option>Print</option>
                 <option>Xerox</option>
                 <option>Design</option>
                 <option>Binding</option>
                 <option>Large Format</option>
               </select>
            </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
               <select
                 className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                 value={formData.priority}
                 onChange={e => setFormData({...formData, priority: e.target.value})}
               >
                 <option>Low</option>
                 <option>Normal</option>
                 <option>Urgent</option>
               </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
            <textarea
              required
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Details about quantity, paper type, size..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Price (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">₹</span>
                <input
                  type="number"
                  min="0"
                  className="w-full pl-7 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                />
              </div>
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Assign Initial Staff</label>
               <select
                 className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                 value={formData.assignedTo}
                 onChange={e => setFormData({...formData, assignedTo: e.target.value})}
               >
                 {EMPLOYEES.map(emp => (
                   <option key={emp} value={emp}>{emp}</option>
                 ))}
               </select>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium transition-colors shadow-md shadow-indigo-200"
          >
            Create Job Entry
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewJob;