import BN from 'bn.js'
import { Form, Formik } from 'formik'
import { FC, useContext, useEffect, useRef, useState } from 'react'
import { Card, Container, InputGroup } from 'react-bootstrap'
import { useQueryClient } from 'react-query'
import { Subscription } from 'web3-core-subscriptions'
import { fromWei, toWei } from 'web3-utils'
import * as yup from 'yup'
import { AccountContext, CasinoContext } from '../App'
import { FormButton, TextField } from '../components/form-fields'
import { Header } from '../components/Header'
import { Wheel, WheelRef } from '../components/Wheel'
import { shuffleExceptAt } from '../utils/collections'


const casinoWheelSchema = yup.object({
  amount: yup.number().moreThan(0).required(),
})

export const CasinoWheelPage: FC = () => {
  const account = useContext(AccountContext)
  const casino = useContext(CasinoContext)

  const queryClient = useQueryClient()

  const [prizes, setPrizes] = useState([''])
  const wheelRef = useRef<WheelRef>(null)


  useEffect(() => {

  const getPrizes = casino.methods.getPrizes().call().then(function(result){
    
 
    setPrizes(result)
  })

    const subscription = casino.events.WheelSpin(async (error, data) => {
      if (error != null) {
        console.error(error)
        return
      }
      if(data.returnValues.player == account){
        const wonPrizeIndex = new BN(data.returnValues.wonPrizeIndex).toNumber()
        //const potentialPrizes = data.returnValues.prizes.map(p => fromWei(p))
        // Shuffle all prizes except the prize at index `wonPrizeIndex`
        const shuffledPrizes = shuffleExceptAt(data.returnValues.prizes, wonPrizeIndex)
        setPrizes(shuffledPrizes)
        await wheelRef.current?.spinToIndex(wonPrizeIndex, 5)
        await queryClient.invalidateQueries('balance')

      }
      
   
    }) as unknown as Subscription<unknown>
    return () => {
      subscription.unsubscribe()
    }
  }, [casino.events, queryClient])

  return (
    <>
      <Header />
      <Container className="mt-4 d-flex justify-content-center">
        <div style={{ maxWidth: '700px' }}>
          <Card>
            <Card.Header as="h3">
              Spin the Wheel! Enter amount and spin
            </Card.Header>
            <Card.Body>
              <Formik
                initialValues={{ amount: '0.05' }}
                validationSchema={casinoWheelSchema}
                onSubmit={async ({ amount }, { resetForm }) => {
                  await casino.methods.spinWheel().send({ from: account, value: toWei(amount),gasPrice:12 })
                  resetForm()
                }}
              >
                {() => (
                  <Form>
                    <TextField
                      name="amount"
                      label="Bet amount"
                      placeholder="Enter your bet"
                      append={<InputGroup.Text>BNB</InputGroup.Text>}
                    />
                    <FormButton>Spin the wheel</FormButton>
                  </Form>
                )}
              </Formik>
              <div className="d-flex justify-content-center">
                <Wheel ref={wheelRef} prizes={prizes} />
              </div>
            </Card.Body>
            <Card.Footer as="h5">
              RoboBUSD:
            </Card.Footer>
          </Card>
        </div>
      </Container>
    </>
  )
}
