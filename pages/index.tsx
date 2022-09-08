import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import moment from "moment";
import axios from "axios";
import {useState} from "react";

const _ = require('lodash');

const Home: NextPage = () => {
    const [accounts, setAccounts] = useState(
        '2RHtye4AUoFuPtvCu5jNmuw5eLqnKXytveVam3Lu6QJx',
    )
    const [logs, setLogs]: any = useState()
    const [isLoading, setIsLoading]: any = useState()

    const getTransactions = (account: any) => {
        return axios.get('https://public-api.solscan.io/account/transactions?account=' + account + '&limit=10')
    }
    const getData = async () => {
        setIsLoading(true)

        const _accounts = accounts.split(/\r?\n/)
        const data: any[] = []
        let n = 0
        while (n < _accounts.length) {
            const transactions = await getTransactions(_accounts[n])
            const result = _.sortBy(transactions.data, function (item: any) {
                return item.blockTime
            })
            const result1 = _.filter(result, function (o: any) {
                return o.parsedInstruction[0].programId == '11111111111111111111111111111111' && o.parsedInstruction[0].program == 'system' && o.parsedInstruction[0].type == 'Unknown'
            })
            const blockTime = result1[result1.length - 1].blockTime
            data.push([
                // moment([result1[result1.length - 1].blockTime, 'DD/MM/YYYY'),
                moment.unix(blockTime).fromNow(),
                // blockTime,
                _accounts[n]])
            n += 1
        }
        // console.log(data)
        // console.log(data)
        setLogs(data.join('\r\n'))
        setIsLoading(false)
        // setLogs(data[0][0])
    }
    return (
        <div className='container'>
      <textarea rows={10} className='form-control mb-3 mt-3' value={accounts} onChange={(e) => {
          setAccounts(e.target.value)
      }}>
      </textarea>
            <label>Result</label>
            <textarea rows={10} className='form-control mb-3' value={logs}>
      </textarea>
            <button className='btn btn-primary' onClick={getData}
                    disabled={isLoading}>{isLoading ? 'loading' : 'fetch'}</button>

        </div>
    )
}

export default Home
