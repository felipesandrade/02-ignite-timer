import { useState } from 'react'
import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from './styles'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(2, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser de no minímo 5 min')
    .max(60, 'O ciclo precisa ser de no máximo 60 min'),
})

// Usando uma interface para integrar o formuário com TypeScript
// interface NewCycleFormData {
//   task: string
//   minutesAmount: number
// }

// Utilizando o Zod para integrar o formulário com TypeScript
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  function handelCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime())

    const newCyle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
    }

    setCycles((state) => [...state, newCyle])

    setActiveCycleId(id)

    reset()
  }

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  // Transformando os munitos setados pelo usuário em segundos
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  // Descobrindo quantos segundos já se passaram desde que começou
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0
  // Descobrindo quantos minutos tem nos segundos correntes
  const minutesAmount = Math.floor(currentSeconds / 60)
  // Descobrindo número de segundos que restam
  const secondsAmount = currentSeconds % 60
  // Adicionando zero quando os minutos só tiver 1 caractere
  const minutes = String(minutesAmount).padStart(2, '0')
  // Adicionando zero quando os segundos só tiver 1 caractere
  const seconds = String(secondsAmount).padStart(2, '0')

  console.log(activeCycle)

  const task = watch('task')

  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handelCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto"
            {...register('task')}
          />

          {/* Exibe sugestões de preenchimento do nome da task */}
          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
            <option value="Banana" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
