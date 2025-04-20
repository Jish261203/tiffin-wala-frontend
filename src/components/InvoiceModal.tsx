import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetInvoice } from "@/api/OrderApi";
import Invoice from "./Invoice";
import { Skeleton } from "./ui/skeleton";

interface InvoiceModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

const InvoiceModal = ({ orderId, isOpen, onClose }: InvoiceModalProps) => {
  const { invoiceData, isLoading } = useGetInvoice(orderId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Invoice</DialogTitle>
          <DialogDescription>
            Invoice details for order #{orderId}
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : invoiceData ? (
          <Invoice invoiceData={invoiceData} />
        ) : (
          <p className="text-center text-gray-500 py-8">
            Failed to load invoice data. Please try again later.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal; 