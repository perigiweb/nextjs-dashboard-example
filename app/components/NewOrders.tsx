'use client'

import { useState, useEffect } from 'react'
import * as XLSX from "xlsx"
import Loading from '../loading'

const moneyFormat = (num: number, locale?: string, currency?: string): string => {
  locale = locale || 'en-US'
  currency = currency || 'USD'
  return new Intl.NumberFormat(locale, { style: "currency", currency: currency }).format(
    num,
  )
}

export default function (){
  const [orders, setOrders] = useState<{no: string, name: string, status: string, total: number}[]>([])
  const [loading, setLoading] = useState(true)
  const [errMsg, setErrMsg] = useState<string|undefined>()
  const [status, setStatus] = useState<'all'|'paid'|'unpaid'>('all')
  const [total, setTotal] = useState<{all:number, paid: number, unpaid: number}>()

  useEffect(() => {
    setLoading(true)
    setErrMsg(undefined)

    const fetchData = async () => {
      try {
        const limit = total ? (total[status] || 20):20
        const response = await fetch(`/api/orders/new?s=${status}&limit=${limit}`)
        if ( !response.ok){
          throw new Error("Failed to fetch new orders")
        }

        const data = await response.json()
        setOrders(data.orders)
        if (status === 'all'){
          setTotal({all: 20, paid: data.totalPaid, unpaid: data.totalUnpaid})
        }
        setLoading(false)
      } catch (err: any){
        console.log({err})
        setLoading(false)
        setErrMsg(err.message)
      }
    }

    fetchData()
  }, [status])

  const downloadExcel = () => {
    if (orders && Array.isArray(orders) && orders.length > 0){
      const d = new Date()
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils?.json_to_sheet(orders);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
      // Save the workbook as an Excel file
      XLSX.writeFile(workbook, `order-${status}-${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}.xlsx`);
    }
  }

  return (<>
    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-lg relative shadow-md p-3">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-jost font-bold text-lg">Visitors</h3>
        <div className="flex gap-1">
          <button type="button" onClick={() => setStatus('all')} className="rounded-sm cursor-pointer border border-slate-500 px-4 py-1 text-xs transition-colors hover:bg-slate-300/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-500 disabled:pointer-events-none disabled:opacity-50">All</button>
          <button type="button" onClick={() => setStatus('paid')} className="rounded-sm cursor-pointer border border-slate-500 px-4 py-1 text-xs transition-colors hover:bg-slate-300/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-500 disabled:pointer-events-none disabled:opacity-50">Paid</button>
          <button type="button" onClick={() => setStatus('unpaid')} className="rounded-sm cursor-pointer border border-slate-500 px-4 py-1 text-xs transition-colors hover:bg-slate-300/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-500 disabled:pointer-events-none disabled:opacity-50">Unpaid</button>
          <button type="button" onClick={downloadExcel} className="rounded-sm border bg-slate-600 text-white border border-slate-700 cursor-pointer px-4 py-1 text-xs transition-colors hover:bg-slate-600/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-600 disabled:pointer-events-none disabled:opacity-50">Download Excel</button>
        </div>
      </div>
      <table className="w-full border-collapse border border-slate-300 dark:border-slate-600 text-sm">
        <thead>
          <tr className="bg-slate-200 dark:bg-slate-700">
            <th className="py-2 px-3 border border-slate-300 dark:border-slate-600 w-[1%]"></th>
            <th className="py-2 px-3 border border-slate-300 dark:border-slate-600">No. Order</th>
            <th className="py-2 px-3 border border-slate-300 dark:border-slate-600">Customer Name</th>
            <th className="py-2 px-3 border border-slate-300 dark:border-slate-600 w-[1%]">Status</th>
            <th className="py-2 px-3 border border-slate-300 dark:border-slate-600">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {(loading || errMsg) ? (
            <tr>
              <td className="py-2 px-3 border border-slate-300 dark:border-slate-600 text-center" colSpan={5}>
                {loading ? (<Loading />):(<span className="text-red-600 dark:text-red-400">{errMsg}</span>)}
              </td>
            </tr>
          ):(
            orders.map((order, index) => (
              <tr key={order.no}>
                <td className="py-2 px-3 border border-slate-300 dark:border-slate-600 w-[1%] text-end">
                  {index+1}
                </td>
                <td className="py-2 px-3 border border-slate-300 dark:border-slate-600">{order.no}</td>
                <td className="py-2 px-3 border border-slate-300 dark:border-slate-600">{order.name}</td>
                <td className="py-2 px-3 border border-slate-300 dark:border-slate-600 text-center w-[1%]">
                  <span className={`block w-full text-center text-xs px-2 py-1 text-white rounded-lg ${order.status === 'paid' ? 'bg-emerald-600':'bg-orange-600'}`}>{order.status}</span>
                </td>
                <td className="py-2 px-3 border border-slate-300 dark:border-slate-600 text-end">{moneyFormat(order.total)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </>)
}