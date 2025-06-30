import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { env } from 'hono/adapter'
import { handle } from 'hono/vercel'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const getRandom = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

const getRandomInt = (min: number, max: number): number => {
  min = Math.floor(min)
  max = Math.ceil(max)

  return Math.floor(Math.random() * (max - min) + min)
}

const app = new Hono().basePath('/api')

app.get('/stats/:r?', (c) => {
  const r = c.req.param('r') || 'last-7-days'
  let days = 7
  if (r === 'last-30-days'){
    days = 30
  }

  const d = new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000)

  const sales0 =  getRandomInt(30, 50)
  const sales = [{
    date: `${d.getDate()}/${d.getMonth()+1}`,
    sales: sales0,
    paid: Math.floor(sales0 * getRandom(0.3, 0.7))
  }]

  const visitor0 = getRandomInt(3000, 5000)
  const visitors = [{
    date: `${d.getDate()}/${d.getMonth()+1}`,
    views: visitor0,
    visitor: Math.floor(visitor0 * getRandom(0.6, 0.9))
  }]

  for(let i=1;i<days;i++){
    d.setDate(d.getDate()+1)
    const salesx = getRandomInt(30, 50)
    sales.push({
      date: `${d.getDate()}/${d.getMonth()+1}`,
      sales: salesx,
      paid: Math.floor(salesx * getRandom(0.3, 0.7))
    })

    const visitorx = getRandomInt(3000, 5000)
    visitors.push({
      date: `${d.getDate()}/${d.getMonth()+1}`,
      views: visitorx,
      visitor: Math.floor(visitorx * getRandom(0.6, 0.9))
    })
  }

  const totalSales = sales.reduce((a, b) => {
    return {
      sales: a.sales+b.sales,
      paid: a.paid+b.paid
    }
  }, {sales: 0, paid: 0})

  const totalVisitors = visitors.reduce((a, b) => {
    return {
      views: a.views+b.views,
      visitor: a.visitor+b.visitor
    }
  }, {views: 0, visitor: 0})

  return c.json({sales, visitors, totalSales, totalVisitors})
})

app.get('/orders/new', c => {
  const orders = []
  const status = c.req.query('s') || 'all'
  const limit: number = parseInt(c.req.query('limit') || '20');
  const maxPaid = status === 'all' ? Math.floor(limit * getRandom(0.3, 0.7)):(status === 'paid' ? limit:-1)

  const tmp = {unpaid:0,paid:0}
  for(let i=0; i<limit; i++){
    let isPaid = (status === 'paid' || getRandomInt(1,3) === 1)
    if (tmp.paid > maxPaid){
      isPaid = false
    }
    if (isPaid){
      tmp.paid++
    } else {
      tmp.unpaid++
    }

    orders.push({
      no: `INV-${getRandomInt(1023434, 1999999)}000`,
      name: `Customer ${getRandomInt(1, 15)}`,
      status: isPaid ? 'paid':'unpaid',
      total: getRandomInt(100, 200)
    })
  }

  return c.json({orders, totalPaid: tmp.paid, totalUnpaid: tmp.unpaid})
})

export const GET = handle(app)
export const POST = handle(app)