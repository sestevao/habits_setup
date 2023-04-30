import dayjs from "dayjs";
import {useCallback, useState} from "react";
import {Alert, ScrollView, Text, View} from "react-native";
import {useFocusEffect, useNavigation} from "@react-navigation/native";

import {api} from "../lib/axios";
import {generateRangeDatesFromYearStart} from "../utils/generate-range-between-dates";

import {Header} from "../components/Header";
import {Loading} from "../components/Loading";
import {daySize, HabitDay} from "../components/HabitDay";

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const datesFromYearStart = generateRangeDatesFromYearStart()
const minimumSummaryDatesSizes = 18*7
const amountOfDaysToFill = minimumSummaryDatesSizes - datesFromYearStart.length

type SummaryProps = Array<{
    id: string;
    date: string;
    amount: number;
    completed: number;
}>

export function HomeScreen() {
    const [loading, setLoading] = useState(true)
    const [summary, setSummary] = useState<SummaryProps | null>(null)

    const {navigate} = useNavigation()

    async function fetchData() {
        try {
            setLoading(true)
            let response = await api.get('summary')
            setSummary(response.data)
        }   catch (error) {
            Alert.alert('Ops', 'Unable to load habit summary.')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useFocusEffect(useCallback(() => {
        fetchData()
    }, []))

    if(loading) {
        return (<Loading />)
    }

  return (
    <View className='flex-1 bg-background px-8 pt-16'>
        <Header />

        <View className='flex-row mt-6 mb-2'>
            {weekDays.map((weekDay, i) => (
                <Text
                    key={`${weekDay} - ${i}`}
                    className='text-zinc-400 text-xl font-bold text-center mx-1'
                    style={{width: daySize}}
                >
                    {weekDay}
                </Text>
            ))}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100}}
        >
            {summary && (
                <View className="flex-row flex-wrap">
                    {datesFromYearStart.map((date) => {
                        const dayWithHabits = summary.find((day) => {
                            return dayjs(date).isSame(day.date, 'day')
                        })

                        return (
                              <HabitDay
                                  date={date}
                                  amount={dayWithHabits?.amount}
                                  completed={dayWithHabits?.completed}
                                  onPress={() => {
                                    // @ts-ignore
                                      navigate("habit", {date: date.toISOString()})
                                  }}
                              />
                          )
                      })}

              {amountOfDaysToFill > 0 &&
                  Array.from({length: amountOfDaysToFill}).map((_, index) => (
                      <View
                          key={index}
                          className="bg-zinc-900 roudned-lg border-2 m-1 border-zinc-800 opacity-40"
                          style={{width: daySize, height: daySize}}
                      />
              ))}

        </View>
        )}
        </ScrollView>
    </View>
  )
}