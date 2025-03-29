"use client";

import { format } from "date-fns";
import { Edit, Globe, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export function SupplierDetailsModal({ supplier, isOpen, onClose, onEdit }) {
  if (!supplier) return null;

  const formattedCreatedDate = format(new Date(supplier.createdAt), "MMMM dd, yyyy");
  const formattedUpdatedDate = format(new Date(supplier.updatedAt), "MMMM dd, yyyy");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{supplier.name}</DialogTitle>
          <DialogDescription>
            Supplier ID: {supplier.id} • Added on {formattedCreatedDate}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {supplier.contactEmail && (
              <div className="flex items-start">
                <Mail className="mr-3 h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p className="text-base break-all">
                    <a href={`mailto:${supplier.contactEmail}`} className="text-blue-600 hover:underline">
                      {supplier.contactEmail}
                    </a>
                  </p>
                </div>
              </div>
            )}

            {supplier.phone && (
              <div className="flex items-start">
                <Phone className="mr-3 h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                  <p className="text-base">
                    <a href={`tel:${supplier.countryCode}${supplier.phone}`} className="hover:underline">
                      {supplier.countryCode} {supplier.phone}
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>

          {supplier.address && (
            <>
              <Separator />
              <div className="flex items-start">
                <MapPin className="mr-3 h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                  <p className="text-base">{supplier.address}</p>
                </div>
              </div>
            </>
          )}

          {supplier.website && (
            <>
              <Separator />
              <div className="flex items-start">
                <Globe className="mr-3 h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Website</h3>
                  <p className="text-base break-all">
                    <a
                      href={supplier.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {supplier.website}
                    </a>
                  </p>
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="text-sm text-muted-foreground">
            <p>Last updated on {formattedUpdatedDate}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              onClose();
              onEdit(supplier);
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Supplier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
