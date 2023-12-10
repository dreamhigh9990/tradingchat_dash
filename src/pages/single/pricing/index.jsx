"use client";
import { useState } from 'react'
// import { RadioGroup } from '@headlessui/react'
import Icons from '@/components/ui/Icon';
import { CHAT_MONTHLY, CHAT_SIXMONTH, CHAT_YEARLY } from '@/constant/constants';
import { useRouter } from 'next/router';
import { QUERY_PARAMS } from '@/configs/query-params';
import { useAuth } from '@/context/authContext';

const frequencies = [
  { value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
  { value: 'annually', label: 'Annually', priceSuffix: '/year' },
]
const tiers = [
 
  {
    name: '1 Month',
    id: 'one-month',
    href: '#',
    value: CHAT_MONTHLY,
    price: { monthly: '$10', annually: '$60' },
    description: '',
    features: [
      '1 Week Trial',
      'Chat Service',
      'Check Stock Informations',
    ],
    mostPopular: true,
  },
  
 
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Pricing() {
  const [frequency, setFrequency] = useState(frequencies[0])
  const { query } = useRouter();
  const { currentUser } = useAuth();

  const _plan = query[QUERY_PARAMS.PLAN];

  const handleBuyPlanClick = async (plan) => {
    try {
      const session = await fetch(`/api/stripe/create-session?plan=${plan}&user_id=${currentUser?.uid}`);
      const sessionJSON = await session.json();
      window.location.replace(sessionJSON.sessionUrl);
    } catch (_ex) {
      console.log({ _ex });
    }
  };

  return (
    <div className="bg-slate-800 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* <h2 className="text-base font-semibold leading-7 text-indigo-400">Pricing</h2> */}
          <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Choose the right plan for you
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-300">
          Choose an affordable plan that’s packed with the best features for engaging your audience, creating customer
          loyalty, and driving sales.
        </p>
        {/* <div className="mt-16 flex justify-center">
          <RadioGroup
            value={frequency}
            onChange={setFrequency}
            className="grid grid-cols-2 gap-x-1 rounded-full bg-white/5 p-1 text-center text-xs font-semibold leading-5 text-white"
          >
            <RadioGroup.Label className="sr-only">Payment frequency</RadioGroup.Label>
            {frequencies.map((option) => (
              <RadioGroup.Option
                key={option.value}
                value={option}
                className={({ checked }) =>
                  classNames(checked ? 'bg-indigo-500' : '', 'cursor-pointer rounded-full px-2.5 py-1')
                }
              >
                <span>{option.label}</span>
              </RadioGroup.Option>
            ))}
          </RadioGroup>
        </div> */}
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3 flex justify-center">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={classNames(
                tier.mostPopular ? 'bg-white/5 ring-2 ring-indigo-500' : 'ring-1 ring-white/10',
                'rounded-3xl p-8 xl:p-10', (_plan == tier.value || currentUser.plan == tier.value) ? 'bg-white/10 ring-1 ring-emerald-300' : ''
              )}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3 id={tier.id} className="text-lg font-semibold leading-8 text-white">
                  {tier.name}
                </h3>
                {tier.mostPopular ? (
                  <p className="rounded-full bg-indigo-500 px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                    Most popular
                  </p>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-300">{tier.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-white">{tier.price[frequency.value]}</span>
                {/* <span className="text-sm font-semibold leading-6 text-gray-300">{frequency.priceSuffix}</span> */}
              </p>
              {(_plan == tier.value || currentUser.plan == tier.value) ?
                <div 
                  aria-describedby={tier.id}
                  className={classNames(
                    'bg-white/5 text-white flex justify-center pr-8',
                    'mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 '
                  )}><Icons className="h-6 w-5 flex-none text-indigo-400 mr-3" icon="heroicons-solid:check" />
                  Selected
                </div>
                : <div
                  onClick={async () => handleBuyPlanClick(tier.value)}
                  aria-describedby={tier.id}
                  className={classNames(
                    tier.mostPopular
                      ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500'
                      : 'bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white',
                    'cursor-pointer mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                  )}>
                  Select plan
                </div>}
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-300 xl:mt-10">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Icons className="h-6 w-5 flex-none text-white" icon="heroicons-solid:check" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
