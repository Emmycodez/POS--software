"use client";

import { format } from "date-fns";
import { Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function NotificationDetailsModal({
  notification,
  isOpen,
  onClose,
  onMarkAsRead,
}) {
  if (!notification) return null;

  const formattedDate = format(
    new Date(notification.createdAt),
    "MMMM dd, yyyy"
  );
  const formattedTime = format(new Date(notification.createdAt), "h:mm a");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {notification.type === "email" ? (
              <Mail className="h-5 w-5 text-blue-500" />
            ) : (
              <MessageSquare className="h-5 w-5 text-green-500" />
            )}
            <span>
              {notification.type === "email" ? "Email" : "SMS"} Notification
            </span>
            {!notification.read && (
              <Badge className="ml-2 bg-blue-500">New</Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Sent on {formattedDate} at {formattedTime}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Product
            </h3>
            <p className="text-base font-semibold">
              {notification.productName}
            </p>
            <p className="text-sm text-muted-foreground">
              SKU: {notification.sku}
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Message
            </h3>
            <p className="text-base mt-1">{notification.message}</p>
          </div>

          {notification.type === "email" && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Additional Information
                </h3>
                <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                  <p>
                    This notification was sent to your registered email address.
                  </p>
                  <p className="mt-1">
                    You can adjust your email notification preferences in your
                    account settings.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          {!notification.read && (
            <Button
              variant="outline"
              onClick={() => {
                onMarkAsRead(notification.id);
                onClose();
              }}
            >
              Mark as read
            </Button>
          )}
          <div className="flex gap-2">
            {notification.type === "email" && (
              <Button variant="outline">Open in email</Button>
            )}
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
