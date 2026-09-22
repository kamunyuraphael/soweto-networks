/** A device the customer wants to put on its own plan (TV, streaming stick, console). */
export interface NetworkDevice {
  id: string
  /** Vendor-guessed name from the MAC, e.g. "Samsung Smart TV", or a generic label if unknown. */
  label: string
  mac: string
}

/** The minimal device info a payment needs: which MAC, and what to call it. */
export interface DeviceRef {
  mac: string
  label: string
}
