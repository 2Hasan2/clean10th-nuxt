interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

const printReceipt = (props: {
  cart: CartItem[];
  customer: { name: string };
  totalPrice: number;
}) => {
  // Create the receipt HTML dynamically
  const receiptHTML = `
    <html>
      <head>
        <title>Receipt</title>
        <style>
          body {
            width: 80mm;
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 0;
          }
          .receipt-header {
            text-align: center;
            margin-bottom: 10px;
          }
          .receipt-header strong {
            font-size: 14px;
          }
          .receipt-table {
            width: 100%;
          }
          .receipt-table th, .receipt-table td {
            font-size: 12px;
          }
          .receipt-table th {
            text-align: left;
          }
          .receipt-table td {
            text-align: right;
          }
          .receipt-divider {
            border: 0.5px dashed #000;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div>
          <div class="receipt-header">
            <span>Date: ${new Date().toLocaleString()}</span>
          </div>
          <div>
            <strong>Customer:</strong> ${props.customer.name || "Unknown"}<br />
          </div>
          <hr class="receipt-divider" />
          <table class="receipt-table">
            <thead>
              <tr>
                <th style="text-align: center;">Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: center;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${props.cart
                .map(
                  (item) => `
                <tr>
                  <td style="text-align: center;">${item.name}</td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: center;">${(
                    item.price * item.quantity
                  ).toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <hr class="receipt-divider" />
          <div style="text-align: center;">
            <strong>Total: $${props.totalPrice.toFixed(2)}</strong>
          </div>
        </div>
        <br />
        <br />
        <button onclick="window.print()">Print</button>
      </body>
    </html>
  `;

  // Open the print window and inject the receipt HTML small
  const printWindow = window.open(
    "",
    "_blank",
    `width=300,height=400,left=${(window.screen.width - 300) / 2},top=${
      (window.screen.height - 400) / 2
    }`
  );
  if (printWindow) {
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.focus();
    // setTimeout(() => {
    //     printWindow.print();
    //     printWindow.close();
    // }, 100);
  }
};

export { printReceipt };
