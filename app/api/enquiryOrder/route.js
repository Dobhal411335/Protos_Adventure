// app/api/enquiryOrder/route.js
import { NextResponse } from 'next/server';
import connectDB from "@/lib/connectDB";
import Enquiry from '@/models/Enquiry';

export async function GET() {
  try {
    await connectDB();
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: enquiries });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch enquiries' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();
    
    const enquiry = new Enquiry(body);
    await enquiry.save();
    
    return NextResponse.json({ success: true, data: enquiry });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create enquiry' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { status } = await request.json();

    if (!['new', 'resolved'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status value' },
        { status: 400 }
      );
    }

    await connectDB();
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedEnquiry) {
      return NextResponse.json(
        { success: false, message: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedEnquiry
    });
  } catch (error) {
    console.error('Error updating enquiry status:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}