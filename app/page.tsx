import StatisticCharts from './components/StatisticCharts'
import NewOrders from './components/NewOrders'

export default function Home() {
  return (<>
    <section className="w-full">
      <div className="flex flex-col gap-y-6 md:gap-y-8">
        <StatisticCharts />
        <NewOrders />
      </div>
    </section>
  </>)
}
