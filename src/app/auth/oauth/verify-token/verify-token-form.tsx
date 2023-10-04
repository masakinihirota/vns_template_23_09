"use client"

import { AuthApiError } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useState, FormEvent } from "react"
import { z, ZodError } from "zod"

import { useSupabase } from "@/app/supabase-provider"
import Alert from "@/components/Alert"
import InputErrorMessage from "@/components/InputErrorMessage"
import { formatError } from "@/lib/utils"
import { AuthUserWithTokenSchema } from "@/lib/validationSchema"

type FormData = z.infer<typeof AuthUserWithTokenSchema>

export default function VerifyTokenForm() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [errors, setErrors] = useState<FormData>()
  const [message, setMessage] = useState<string>("")
  const [formSuccess, setFormSuccess] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: "",
    token: ""
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // reset all states
    setFormSuccess(false)
    setErrors(undefined)
    setMessage("")

    const email = formData.email
    const token = formData.token

    try {
      AuthUserWithTokenSchema.parse({ email, token })
    } catch (err) {
      if (err instanceof ZodError) {
        const errs = formatError(err) as FormData
        setErrors(errs)
        return
      }
    }

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email"
    })

    if (error) {
      if (error instanceof AuthApiError && error.status === 400) {
        setMessage("Invalid credentials.")
        return
      }
      setMessage(error.message)
      return
    }

    // reset form
    setFormData({ email: "", token: "" })
    router.push("/")
  }

  return (
    <div className="">
      {message ? (
        <Alert
          className={`${formSuccess ? "alert-info" : "alert-error"} mb-10`}
        >
          {message}
        </Alert>
      ) : null}
      <h2 className="">Sign in</h2>
      <p className="">Hi, Welcome back</p>
      <form onSubmit={handleSubmit}>
        <div className="">
          <label htmlFor="email" className="">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            value={formData?.email ?? ""}
            onChange={(ev) =>
              setFormData({ ...formData, email: ev.target.value })
            }
            className=""
          />
        </div>
        {errors?.email ? (
          <InputErrorMessage>{errors?.email}</InputErrorMessage>
        ) : null}
        <div className="">
          <label htmlFor="token" className="label">
            Token
          </label>
          <input
            id="token"
            name="token"
            type="text"
            value={formData?.token ?? ""}
            onChange={(ev) =>
              setFormData({ ...formData, token: ev.target.value })
            }
            className=""
          />
        </div>
        {errors?.token ? (
          <InputErrorMessage>{errors?.token}</InputErrorMessage>
        ) : null}
        <div className="">
          <button className="">Sign in</button>
        </div>
      </form>
    </div>
  )
}
