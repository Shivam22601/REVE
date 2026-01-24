import React, { useState, useEffect } from 'react'
import { adminAPI, productAPI } from '../../config/api'

const ManualEditor = () => {
  const [manuals, setManuals] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingManual, setEditingManual] = useState(null)
  const [formData, setFormData] = useState({
    productId: '',
    title: '',
    tagline: '',
    intro: '',
    features: [''],
    usage: [''],
    care: [''],
    images: []
  })

  useEffect(() => {
    fetchManuals()
    fetchProducts()
  }, [])

  const fetchManuals = async () => {
    try {
      const data = await adminAPI.getManuals()
      setManuals(data)
    } catch (error) {
      console.error('Failed to fetch manuals:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const data = await productAPI.getProducts()
      setProducts(data.data || data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      productId: '',
      title: '',
      tagline: '',
      intro: '',
      features: [''],
      usage: [''],
      care: [''],
      images: []
    })
    setEditingManual(null)
  }

  const openCreateForm = () => {
    resetForm()
    setShowCreateForm(true)
  }

  const openEditForm = (manual) => {
    setFormData({
      productId: manual.product._id,
      title: manual.title,
      tagline: manual.tagline,
      intro: manual.intro,
      features: manual.features.length > 0 ? manual.features : [''],
      usage: manual.usage.length > 0 ? manual.usage : [''],
      care: manual.care.length > 0 ? manual.care : [''],
      images: manual.images || []
    })
    setEditingManual(manual)
    setShowCreateForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const submitData = new FormData()
      
      // Add text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'images') {
          if (Array.isArray(formData[key])) {
            formData[key].forEach((item, index) => {
              submitData.append(`${key}[${index}]`, item)
            })
          } else {
            submitData.append(key, formData[key])
          }
        }
      })

      // Add image files
      formData.images.forEach((file, index) => {
        submitData.append('images', file)
      })

      if (editingManual) {
        await adminAPI.updateManual(editingManual._id, submitData)
      } else {
        await adminAPI.createManual(submitData)
      }
      setShowCreateForm(false)
      resetForm()
      fetchManuals()
    } catch (error) {
      console.error('Failed to save manual:', error)
      alert('Failed to save manual: ' + (error.message || 'Unknown error'))
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this manual?')) return
    try {
      await adminAPI.deleteManual(id)
      fetchManuals()
    } catch (error) {
      console.error('Failed to delete manual:', error)
      alert('Failed to delete manual')
    }
  }

  const updateArray = (field, index, value) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData({ ...formData, [field]: newArray })
  }

  const addItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] })
  }

  const removeItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index)
    setFormData({ ...formData, [field]: newArray })
  }

  if (loading) return <div className="p-6">Loading manuals...</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Manuals</h1>
        <button
          onClick={openCreateForm}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Manual
        </button>
      </div>

      {/* Manuals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {manuals.map((manual) => (
          <div key={manual._id} className="bg-white p-4 rounded-lg shadow border">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{manual.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditForm(manual)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(manual._id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">{manual.product.name}</p>
            <p className="text-sm text-gray-500">{manual.tagline}</p>
            <div className="mt-2 text-xs text-gray-400">
              Features: {manual.features.length} | Usage: {manual.usage.length} | Care: {manual.care.length}
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingManual ? 'Edit Manual' : 'Create Manual'}
              </h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium mb-1">Product</label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                  disabled={!!editingManual}
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-sm font-medium mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Intro */}
              <div>
                <label className="block text-sm font-medium mb-1">Introduction</label>
                <textarea
                  value={formData.intro}
                  onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                  className="w-full p-2 border rounded h-24"
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium mb-2">Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files)
                    setFormData({ ...formData, images: [...formData.images, ...files] })
                  }}
                  className="w-full p-2 border rounded"
                />
                {formData.images.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.images.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={file.url || URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-20 h-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = formData.images.filter((_, i) => i !== index)
                            setFormData({ ...formData, images: newImages })
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium mb-2">Features</label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateArray('features', index, e.target.value)}
                      className="flex-1 p-2 border rounded"
                      placeholder="Feature description"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem('features', index)}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addItem('features')}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Feature
                </button>
              </div>

              {/* Usage */}
              <div>
                <label className="block text-sm font-medium mb-2">Usage Instructions</label>
                {formData.usage.map((instruction, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={instruction}
                      onChange={(e) => updateArray('usage', index, e.target.value)}
                      className="flex-1 p-2 border rounded"
                      placeholder="Usage instruction"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem('usage', index)}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addItem('usage')}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Instruction
                </button>
              </div>

              {/* Care */}
              <div>
                <label className="block text-sm font-medium mb-2">Care Instructions</label>
                {formData.care.map((instruction, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={instruction}
                      onChange={(e) => updateArray('care', index, e.target.value)}
                      className="flex-1 p-2 border rounded"
                      placeholder="Care instruction"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem('care', index)}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addItem('care')}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Instruction
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {editingManual ? 'Update Manual' : 'Create Manual'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManualEditor