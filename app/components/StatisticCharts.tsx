'use client'

import { useState, useEffect } from 'react'
import {
  XAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar
} from "recharts"
import Loading from '../loading'

export default function () {
  const [visitors, setVisitors] = useState([])
  const [sales, setSales] = useState([])
  const [visitorErrMsg, setVisitorErrMsg] = useState()
  const [salesErrMsg, setSalesErrMsg] = useState()
  const [loadingVisitors, setLoadingVisitors] = useState(true)
  const [loadingSales, setLoadingSales] = useState(true)
  const [stat, setStat] = useState<'all'|'visitors'|'sales'>('all')
  const [statRange, setStatRange] = useState<'last-7-days'|'last-30-days'>('last-7-days')

  useEffect(() => {
    if (stat === 'all' || stat === 'sales'){
      setLoadingSales(true)
      setSalesErrMsg(undefined)
    }
    if (stat === 'all' || stat === 'visitors'){
      setLoadingVisitors(true)
      setVisitorErrMsg(undefined)
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/stats/${statRange}`)
        if ( !response.ok){
          throw new Error("Failed to fetch statistic data")
        }

        const data = await response.json()
        if (stat === 'all' || stat === 'sales'){
          setSales(data.sales)
          setLoadingSales(false)
        }
        if (stat === 'all' || stat === 'visitors'){
          setVisitors(data.visitors)
          setLoadingVisitors(false)
        }
      } catch (err: any){
        if (stat === 'all' || stat === 'sales'){
          setLoadingSales(false)
          setSalesErrMsg(err.message)
        }
        if (stat === 'all' || stat === 'visitors'){
          setLoadingVisitors(false)
          setVisitorErrMsg(err.message)
        }
      }
    }

    fetchData()
  }, [stat, statRange])

  const setStatParams = (s: 'all'|'visitors'|'sales', r: 'last-7-days'|'last-30-days'): void => {
    setStat(s)
    setStatRange(r)
  }

  return (<>
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-1/2 bg-slate-100 dark:bg-slate-700 rounded-lg relative shadow-md">
        <div className="flex justify-between items-center p-3">
          <h3 className="font-jost font-bold text-lg">Visitors</h3>
          <div className="flex gap-1">
            <button type="button" onClick={() => setStatParams('visitors', 'last-30-days')} className="rounded-md cursor-pointer border border-slate-500 px-4 py-1 text-xs transition-colors hover:bg-slate-300/90 dark:hover:bg-slate-600/90  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-500 disabled:pointer-events-none disabled:opacity-50">Last 30 Days</button>
            <button type="button" onClick={() => setStatParams('visitors', 'last-7-days')} className="rounded-md cursor-pointer border border-slate-500 px-4 py-1 text-xs transition-colors hover:bg-slate-300/90 dark:hover:bg-slate-600/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-500 disabled:pointer-events-none disabled:opacity-50">Last 7 Days</button>
          </div>
        </div>
        <div className="h-[300px]">
        {
          loadingVisitors ? (
            <div className="h-full flex justify-center items-center">
              <Loading />
            </div>
          ):(
            visitorErrMsg ? (
              <div className="h-full flex justify-center items-center text-red-600 dark:text-red-400">{visitorErrMsg}</div>
            ):(
              <ResponsiveContainer width="100%" height="100%" className={`text-xs`}>
                <LineChart
                  width={600}
                  height={300}
                  data={visitors}
                  margin={{
                    top: 8,
                    right: 32,
                    left: 32,
                    bottom: 8,
                  }}
                >
                  <CartesianGrid strokeDasharray="4 4" className="stroke-slate-300 dark:stroke-slate-600" />
                  <XAxis dataKey="date" stroke="oklch(70.4% 0.04 256.788)" />
                  <Legend verticalAlign="top" height={36} />
                  <Tooltip wrapperClassName="text-slate-900" />
                  <Line type="monotone" dataKey="views" name={`Page Views`} stroke="oklch(70.5% 0.213 47.604)" strokeWidth={2} />
                  <Line type="monotone" dataKey="visitor" name={`Visitors`} stroke="oklch(69.6% 0.17 162.48)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )
          )
        }
        </div>
      </div>
      <div className="w-1/2 bg-slate-100 dark:bg-slate-700 rounded-lg relative shadow-md">
        <div className="flex justify-between items-center p-3">
          <h3 className="font-jost font-bold text-lg">Sales</h3>
          <div className="flex gap-1">
            <button type="button" onClick={() => setStatParams('sales', 'last-30-days')} className="rounded-md cursor-pointer border border-slate-500 px-4 py-1 text-xs transition-colors hover:bg-slate-300/90 dark:hover:bg-slate-600/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-500 disabled:pointer-events-none disabled:opacity-50">Last 30 Days</button>
            <button type="button" onClick={() => setStatParams('sales', 'last-7-days')} className="rounded-md cursor-pointer border border-slate-500 px-4 py-1 text-xs transition-colors hover:bg-slate-300/90 dark:hover:bg-slate-600/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-500 disabled:pointer-events-none disabled:opacity-50">Last 7 Days</button>
          </div>
        </div>
        <div className="h-[300px]">
        {
          loadingSales ? (
            <div className="h-full flex justify-center items-center">
              <Loading />
            </div>
          ):(
            salesErrMsg ? (
              <div className="h-full flex justify-center items-center text-red-600 dark:text-red-400">{salesErrMsg}</div>
            ):(
              <ResponsiveContainer width="100%" height="100%" className={`text-xs`}>
                <BarChart width={600} height={300} data={sales}
                  margin={{
                    top: 8,
                    right: 32,
                    left: 32,
                    bottom: 8,
                  }}
                >
                  <XAxis dataKey="date" stroke="oklch(70.4% 0.04 256.788)" />
                  <Tooltip wrapperClassName="text-slate-900" />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="sales" name="Total Orders" fill="oklch(70.5% 0.213 47.604)" />
                  <Bar dataKey="paid" name="Paid Orders" fill="oklch(69.6% 0.17 162.48)" />
                </BarChart>
              </ResponsiveContainer>
            )
          )
        }
        </div>
      </div>
    </div>
  </>)
}