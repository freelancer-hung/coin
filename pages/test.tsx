import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import moment from "moment";
import axios from "axios";
import {useState} from "react";

const _ = require('lodash');

const Home: NextPage = () => {
    const [account, setAccount] = useState(
        '2RHtye4AUoFuPtvCu5jNmuw5eLqnKXytveVam3Lu6QJx',
    )
    const [logs, setLogs]: any = useState()
    const [isLoading, setIsLoading]: any = useState()
    const [data, setData]: any = useState()
    const getData = async () => {
        const data: any[] = []
        let transaction: any
        const transactions = await axios.get('https://public-api.solscan.io/account/transactions?account='+account+'&limit=50')
        console.log(transactions.data);
        let n = 0
        while (n < transactions.data.length) {
            transaction = await axios.get('https://public-api.solscan.io/transaction/' + transactions.data[n].txHash)

            // kiểm tra nếu có extra
            console.log(transaction.data.innerInstructions[0]?.parsedInstructions);

            data.push({
                'signature': '2nCr35Ksuwzjh1Pe1oBXfeNA9oee5hB1CRNA4yWSWCHYypaQ1pNMVRq3STHruK8df2iRASZ2DwJh5ucfJJ5RPxhF',
                'main_actions': transaction.data.innerInstructions[0]?.parsedInstructions
            });
            n += 1
        }
        setData(data);
        console.log(data);
    }
    if (data) {
        return (
            <div className='container'>

                {data.map((item, index) => {
                    return (
                        <div>
                            <div>
                                {item.signature}
                            </div>
                            <ul>
                                {item.main_actions?.map((item1, index1) => {
                                    if (item1?.extra) {
                                        return (
                                            <li>
                                                {item1?.extra?.tokenAddress} | <b>{item1?.extra?.symbol}</b>
                                            </li>
                                        )
                                    }
                                })}
                            </ul>
                        </div>
                    );
                })}
            </div>
        )
    }
    return (
        <div className='container'>
            <input type="text" value={account} onChange={(e) => {
                setAccount(e.target.value)
            }}/>
            <label>Result</label>
            <textarea rows={10} className='form-control mb-3' value={logs}>
                </textarea>
            <button className='btn btn-primary' onClick={getData}
                    disabled={isLoading}>{isLoading ? 'loading' : 'fetch'}</button>

        </div>
    )
}

export default Home
