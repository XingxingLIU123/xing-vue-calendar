<template>
  <div class="xCalendar">
    <div class="xCalendar-week">
      <span class="xCalendar-week-item" v-for="item in weeks" :key="item">{{item}}</span>
    </div>
    <div class="xCalendar-month">
      <div class="xCalendar-month-item" v-for="(item, index) in dayDetails" :key="item.name + item.year">
        <div class="xCalendar-month-item-title">{{item.name}} {{item.year}}</div>
        <div class="xCalendar-month-item-warpper">
          <span class="xCalendar-month-item-day" v-for="m in item.firstWeek" :key="item.name + item.year + m"></span>
          <span class="xCalendar-month-item-day"
           @click="setDate($event, item, i, i.day)" 
           :class="{
             'xCalendar-month-item-day-disabled': (i.day < minDate.split('-')[2] && index === 0) || (i.day > limitDate.max.split('-')[2] && index === dayDetails.length - 1), 
             'xCalendar-isSelectd': i.isSelectd,
             'xCalendar-transition': i.time > new Date(selectDate[0]).getTime() && i.time < new Date(selectDate[1]).getTime()}" 
             v-for="i in item.day" 
             :key="item.year + item.name + i.day">
            {{i.day}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const date = new Date()
const getMon = year => {
  let monthDay = [
    {name: 'Jan', days: 31, year, month: 1},
    {name: 'Feb', days: 28, year, month: 2},
    {name: 'Mar', days: 31, year, month: 3},
    {name: 'Apr', days: 30, year, month: 4},
    {name: 'May', days: 31, year, month: 5},
    {name: 'Jun', days: 30, year, month: 6},
    {name: 'Jul', days: 31, year, month: 7},
    {name: 'Aug', days: 31, year, month: 8},
    {name: 'Sep', days: 30, year, month: 9},
    {name: 'Oct', days: 31, year, month: 10},
    {name: 'Nov', days: 30, year, month: 11},
    {name: 'Dec', days: 31, year, month: 12}  
  ]
  if (year % 4 === 0) {
    monthDay[1].days = 29
  }
  monthDay.map((item, index) => {
    const thisDate = new Date(year + '-' + (index + 1) + '-1')
    item.firstWeek = thisDate.getDay()
    item.day = []
    for(let i = 0; i < item.days; i++) {
      item.day.push({day: i + 1, isSelectd: false, time: new Date(item.year + '-' + item.month + '-' + (i + 1)).getTime()})
    }
  })
  console.log(monthDay)
  return monthDay
}
export default {
  name: 'xCalendar',
  props: {
    isSingle: {
      type: Boolean,
      required: false,
      default: true
    },
    minDate: {
      type: String,
      required: false,
      default: () => {
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      }
    },
    maxDate: {
      type: String,
      required: false,
      default: () => {
        // 业务默认最大为350天后
        const minTime = date.getTime()
        const oneDayTime = 1000 * 60 * 60 * 24
        const maxTime = minTime + oneDayTime * 350
        const max = new Date(maxTime)
        return max.getFullYear() + '-' + (max.getMonth() + 1) + '-' + max.getDate()
      }
    }
  },
  computed: {
    limitDate () {
      const minTime = new Date(this.minDate).getTime()
      const oneDayTime = 1000 * 60 * 60 * 24
      const maxTime = minTime + oneDayTime * 350
      const max = new Date(maxTime)
      return {
        min: this.minDate,
        max: max.getFullYear() + '-' + (max.getMonth() + 1) + '-' + max.getDate()
      }
    }
  },
  data () {
    return {
      selectDate: [],
      dayDetails: [],
      today: '',
      weeks: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    }
  },
  created () {
    this.today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    const monthCode = parseInt(this.minDate.split('-')[1]) - 1
    const monthsNum = (this.limitDate.max.split('-')[0] - this.limitDate.min.split('-')[0]) * 12 + 1 + (this.limitDate.max.split('-')[1] - this.limitDate.min.split('-')[1])
    let monthAry = null
    for (let i = 0; i < 3; i++) {
      if (monthAry !== null) {
        monthAry = monthAry.concat(getMon(parseInt(this.minDate.split('-')[0]) + i))
      } else {
        monthAry = getMon(parseInt(this.minDate.split('-')[0]))
      }
    }
    this.dayDetails = monthAry.slice(monthCode, monthCode + monthsNum)
  },
  mounted () {
    console.log(this.dayDetails)
  },
  methods: {
    setDate (e, item, day, index) {
      // 日期是否被禁用
      if (e.target.classList.value.includes('xCalendar-month-item-day-disabled')) {
        console.warn('current date can not be choosed')
        return false
      } else {
        // 选两个时间
        if (!this.isSingle) {
          if (this.selectDate.length < 2) {
            // 选中时间
            if (!day.isSelectd) {
              this.selectDate.push(item.year + '-' + item.month + '-' + index)
              day.isSelectd = true
            }
            // 取消选中时间
            else {
              day.isSelectd = false
              const index = this.selectDate.findIndex((n) => n === item.year + '-' + item.month + '-' + index)
              this.selectDate.splice(index, 1)
            }
          } else {
            this.selectDate = []
            this.dayDetails.map(item => {
              item.day.map(i => {
                i.isSelectd = false
              })
            })
            this.selectDate.push(item.year + '-' + item.month + '-' + index)
            day.isSelectd = true
          }
        }
        // 选单个时间
        else {
          this.dayDetails.map(item => {
            item.day.map(i => {
              i.isSelectd = false
            })
          })
          day.isSelectd = true
          this.selectDate = [item.year + '-' + (item.month + 1) + '-' + index]
        }
        console.log(this.selectDate.sort())
        // 排序
        if (this.selectDate.length === 2) {
          if (new Date(this.selectDate[0]).getTime() > new Date(this.selectDate[1]).getTime()) {
            const max = this.this.selectDate[0]
            this.selectDate.length = 1
            this.selectDate.push(max)
          }
        }
        this.$emit('changed', this.selectDate)
      }
    }
  }
}
</script>

<style>
html, body{
  margin: 0;
  padding: 0;
}
.xCalendar{
  padding-top: 1.5rem;
  position: relative;
}
.xCalendar, .xCalendar-week{
  width: 100%;
}
.xCalendar-week{
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  border-bottom: 2px solid #bbb;
  height: 1.5rem;
  display: flex;
  justify-content: space-around;
}
.xCalendar-week-item{
  width: 14.28571%;
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: #3C3C3C;
}
.xCalendar-month{
  text-align: center;
}
.xCalendar-month-item-warpper{
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}
.xCalendar-month-item-title{
  height: 2.75rem;
  line-height: 2.75rem;
  color: #3C3C3C;
  font-weight: 500;
}
.xCalendar-month-item-day{
  display: inline-block;
  width: 14.28571%;
  height: 3.375rem;
  line-height: 3.375rem;
  color: #3C3C3C;
  font-weight: 500;
}
.xCalendar-month-item-day-disabled{
  background: #f2f2f2;
  color: #999;
}
.xCalendar-isSelectd{
  background-color: #FFB3C1;
}
.xCalendar-transition{
  background-color: #FFE6EA;
}
</style>


