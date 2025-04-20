import { formatPrice } from "@/utils/format";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Download, Printer } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface InvoiceProps {
  invoiceData: {
    orderNumber: string;
    date: string;
    customerDetails: {
      name: string;
      email: string;
      address: {
        line1: string;
        city: string;
        country: string;
      };
    };
    restaurantDetails: {
      name: string;
      address: string;
    };
    items: {
      name: string;
      quantity: number;
      price: number;
      total: number;
    }[];
    subtotal: number;
    deliveryFee: number;
    totalAmount: number;
    status: string;
    paymentStatus: string;
  };
}

const Invoice = ({ invoiceData }: InvoiceProps) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const invoiceContent = document.getElementById('invoice-content');
    if (!invoiceContent) return;

    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    printWindow.document.write('<html><head><title>Invoice</title>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(invoiceContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-4xl mx-auto"
    >
      <div className="flex justify-end space-x-2 mb-4 print:hidden">
        <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
          <Printer size={16} />
          Print
        </Button>
        <Button variant="outline" onClick={handleDownload} className="flex items-center gap-2">
          <Download size={16} />
          Download
        </Button>
      </div>
      
      <Card className="p-6" id="invoice-content">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-orange-500 mb-2">INVOICE</h1>
            <p className="text-gray-600">Order #{invoiceData.orderNumber.substring(0, 8)}</p>
            <p className="text-gray-600">
              Date: {format(new Date(invoiceData.date), "PPP")}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-semibold mb-2">{invoiceData.restaurantDetails.name}</h2>
            <p className="text-gray-600">{invoiceData.restaurantDetails.address}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Bill To:</h3>
            <p className="text-gray-700">{invoiceData.customerDetails.name}</p>
            <p className="text-gray-600">{invoiceData.customerDetails.email}</p>
            <p className="text-gray-600">{invoiceData.customerDetails.address.line1}</p>
            <p className="text-gray-600">
              {invoiceData.customerDetails.address.city}, {invoiceData.customerDetails.address.country}
            </p>
          </div>
          <div className="text-right">
            <h3 className="text-lg font-semibold mb-2">Status:</h3>
            <p className="text-gray-700">Order Status: {invoiceData.status}</p>
            <p className="text-gray-700">Payment Status: {invoiceData.paymentStatus}</p>
          </div>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2">Item</th>
              <th className="text-right py-2">Quantity</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-2">{item.name}</td>
                <td className="text-right py-2">{item.quantity}</td>
                <td className="text-right py-2">{formatPrice(item.price)}</td>
                <td className="text-right py-2">{formatPrice(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between mb-2">
              <span>Delivery Fee:</span>
              <span>{formatPrice(invoiceData.deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
              <span>Total:</span>
              <span>{formatPrice(invoiceData.totalAmount)}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default Invoice; 