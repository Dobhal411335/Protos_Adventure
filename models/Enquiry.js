import { Schema, models, model } from "mongoose";

const EnquirySchema = new Schema({
    // Form Fields
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    productName: { type: String, required: true },
    message: { type: String, required: true },
    contactMethod: { type: String, enum: ['Email', 'Phone', 'WhatsApp'], default: 'Email' },
    
    // Product Info
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    productPrice: { type: Number },
    productImage: { type: String },
    status: { type: String, enum: ['new', 'resolved'], default: 'new' },
}, { timestamps: true });

// Add text index for search
EnquirySchema.index({
    fullName: 'text',
    email: 'text',
    phone: 'text',
    productName: 'text',
    message: 'text'
});

export default models.Enquiry || model("Enquiry", EnquirySchema);