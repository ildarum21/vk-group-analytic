import type { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import * as axios from 'axios'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { Triangle } from 'react-loader-spinner'

ChartJS.register(ArcElement, Tooltip, Legend)

export const data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }
  ]
}

const Home: NextPage = () => {
  const [groupName, setGroupName] = useState('')
  const [groupId, setGroupId] = useState('')
  const [error, setError] = useState(false)
  const [inProgress, setInProgress] = useState(false)
  const [sexData, setSexData] = useState({})
  const [ageData, setAgeData] = useState({})
  //57846937
  const getData = () => {
    setInProgress(true)
    axios
      .get(`http://localhost:3001/getGroupMembers?group_id=${groupId}`)
      .then((res) => {
        if (
          res.data.group_name !== '' &&
          res.data.group_name !== 'Private group' &&
          res.data.group_name !== 'DELETED'
        ) {
          setError(false)
          setGroupName(res.data.group_name)

          setSexData({
            labels: ['Male', 'Female'],
            datasets: [
              {
                label: '# of Votes',
                data: [res.data.sex.male, res.data.sex.female],
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1
              }
            ]
          })
          setAgeData({
            labels: ['adult(18-59)', 'child(0-11)', 'Not Specified', 'old(60+)', 'teenagers(12-17)'],
            datasets: [
              {
                label: '# of Votes',
                data: [
                  res.data.age.adult,
                  res.data.age.child,
                  res.data.age.notSpecified,
                  res.data.age.old,
                  res.data.age.teenagers
                ],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
              }
            ]
          })
          setInProgress(false)
        } else {
          setError(true)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>VK GROUP ANALYTICS</title>
        <meta name="description" content="Generated by create next app" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <div className={styles.main}>
        <div className="groupInfo">
          <span>Past group ID/screen name: </span>
          <input
            type="text"
            value={groupId}
            onChange={(e) => {
              setGroupId(e.target?.value || '')
            }}
            style={{ marginLeft: 10, outline: 'none' }}
          />
          <button
            onClick={() => {
              getData()
            }}
            disabled={groupId === '' || inProgress}
            style={{ marginLeft: 10 }}>
            calculate
          </button>
        </div>
        {!inProgress ? (
          <>
            {error ? (
              <>Group not found or is Private group or DELETED group!</>
            ) : (
              <>
                {groupName !== '' && <h1 className={styles.title}>{groupName}</h1>}
                <div className={styles.stats}>
                  {sexData?.datasets && (
                    <div className={styles.chart}>
                      <Pie data={sexData} />
                    </div>
                  )}
                  {ageData?.datasets && (
                    <div className={styles.chart}>
                      <Pie data={ageData} />
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <div
            style={{
              marginTop: 30,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <Triangle height="100" width="100" color="grey" ariaLabel="loading" />
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
