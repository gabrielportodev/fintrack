'use client'

import {
  updateProfileSchema,
  changePasswordSchema,
  type UpdateProfileSchemaType,
  type ChangePasswordSchemaType
} from '@/schemas/auth.schema'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/shared/page-header'
import { UserAvatar } from '@/components/shared/user-avatar'
import { PasswordInput } from '@/components/ui/password-input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getErrorMessage } from '@/lib/utils'
import { authService } from '@/lib/api/auth'
import { Upload, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

const MAX_AVATAR_SIZE = 1024 * 1024 // 1MB
const ACCEPTED_AVATAR_TYPES = ['image/png', 'image/jpeg']

const hasValidImageSignature = async (file: File): Promise<boolean> => {
  const header = new Uint8Array(await file.slice(0, 8).arrayBuffer())
  const isPng =
    header[0] === 0x89 &&
    header[1] === 0x50 &&
    header[2] === 0x4e &&
    header[3] === 0x47 &&
    header[4] === 0x0d &&
    header[5] === 0x0a &&
    header[6] === 0x1a &&
    header[7] === 0x0a
  const isJpeg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff
  return isPng || isJpeg
}

const ProfilePage = () => {
  const { user, updateUser } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const profileForm = useForm<UpdateProfileSchemaType>({
    resolver: zodResolver(updateProfileSchema),
    values: { name: user?.name ?? '', email: user?.email ?? '' }
  })

  const passwordForm = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' }
  })

  useEffect(() => {
    if (user) profileForm.reset({ name: user.name, email: user.email })
  }, [user, profileForm])

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : null

  const onSelectAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
      toast.error('A imagem deve ser PNG ou JPEG.')
      return
    }
    if (file.size > MAX_AVATAR_SIZE) {
      toast.error('A imagem deve ter no máximo 1MB.')
      return
    }
    if (!(await hasValidImageSignature(file))) {
      toast.error('O arquivo não é uma imagem PNG ou JPEG válida.')
      return
    }

    try {
      setUploadingAvatar(true)
      const updated = await authService.updateAvatar(file)
      updateUser(updated)
      toast.success('Foto de perfil atualizada')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Não foi possível enviar a foto.'))
    } finally {
      setUploadingAvatar(false)
    }
  }

  const onRemoveAvatar = async () => {
    try {
      setUploadingAvatar(true)
      const updated = await authService.removeAvatar()
      updateUser(updated)
      toast.success('Foto de perfil removida')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Não foi possível remover a foto.'))
    } finally {
      setUploadingAvatar(false)
    }
  }

  const onUpdateProfile = async (data: UpdateProfileSchemaType) => {
    try {
      const updated = await authService.updateProfile(data)
      updateUser(updated)
      profileForm.reset({ name: updated.name, email: updated.email })
      toast.success('Perfil atualizado com sucesso')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Não foi possível atualizar o perfil.'))
    }
  }

  const onChangePassword = async (data: ChangePasswordSchemaType) => {
    try {
      const { message } = await authService.changePassword(data)
      passwordForm.reset({ currentPassword: '', newPassword: '', confirmPassword: '' })
      toast.success(message)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Não foi possível alterar a senha.'))
    }
  }

  return (
    <div className='flex flex-col flex-1 min-h-0 overflow-y-auto'>
      <PageHeader title='Perfil' subtitle={memberSince ? `Membro desde ${memberSince}` : undefined} />

      <div className='flex-1 px-4 py-5 sm:px-8 sm:py-6'>
        <div className='flex flex-col gap-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 items-start lg:items-stretch'>
            <Card>
              <CardHeader>
                <CardTitle>Foto de perfil</CardTitle>
                <CardDescription>Adicione uma foto sua. PNG ou JPG de até 1MB.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex items-center gap-5'>
                  <UserAvatar
                    name={user?.name}
                    avatarUrl={user?.avatarUrl}
                    className='h-16 w-16 rounded-full text-xl'
                  />
                  <div className='flex flex-col gap-2'>
                    <input
                      ref={fileInputRef}
                      type='file'
                      accept='image/png,image/jpeg'
                      className='hidden'
                      onChange={onSelectAvatar}
                    />
                    <div className='flex flex-wrap gap-2'>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        disabled={uploadingAvatar}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload size={15} />
                        {uploadingAvatar ? 'Enviando...' : user?.avatarUrl ? 'Trocar foto' : 'Enviar foto'}
                      </Button>
                      {user?.avatarUrl && (
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          disabled={uploadingAvatar}
                          onClick={onRemoveAvatar}
                          className='text-destructive hover:text-destructive'
                        >
                          <Trash2 size={15} />
                          Remover
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações pessoais</CardTitle>
                <CardDescription>Atualize seu nome e endereço de e-mail.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className='flex flex-col gap-4'>
                  <div className='flex flex-col gap-1.5'>
                    <Label htmlFor='name'>Nome</Label>
                    <Input id='name' type='text' placeholder='Seu nome' {...profileForm.register('name')} />
                    {profileForm.formState.errors.name && (
                      <p className='text-[12px] text-destructive'>{profileForm.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className='flex flex-col gap-1.5'>
                    <Label htmlFor='email'>E-mail</Label>
                    <Input id='email' type='email' placeholder='seu@email.com' {...profileForm.register('email')} />
                    {profileForm.formState.errors.email && (
                      <p className='text-[12px] text-destructive'>{profileForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className='flex justify-end pt-1'>
                    <Button
                      type='submit'
                      disabled={profileForm.formState.isSubmitting || !profileForm.formState.isDirty}
                    >
                      {profileForm.formState.isSubmitting ? 'Salvando...' : 'Salvar alterações'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Alterar senha</CardTitle>
              <CardDescription>Informe a senha atual e escolha uma nova senha.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className='flex flex-col gap-4'>
                <div className='flex flex-col gap-1.5'>
                  <Label htmlFor='currentPassword'>Senha atual</Label>
                  <PasswordInput
                    id='currentPassword'
                    placeholder='Sua senha atual'
                    autoComplete='current-password'
                    {...passwordForm.register('currentPassword')}
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className='text-[12px] text-destructive'>
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className='flex flex-col gap-1.5'>
                  <Label htmlFor='newPassword'>Nova senha</Label>
                  <PasswordInput
                    id='newPassword'
                    placeholder='Mínimo 8 caracteres'
                    autoComplete='new-password'
                    {...passwordForm.register('newPassword')}
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className='text-[12px] text-destructive'>{passwordForm.formState.errors.newPassword.message}</p>
                  )}
                </div>

                <div className='flex flex-col gap-1.5'>
                  <Label htmlFor='confirmPassword'>Confirmar nova senha</Label>
                  <PasswordInput
                    id='confirmPassword'
                    placeholder='Repita a nova senha'
                    autoComplete='new-password'
                    {...passwordForm.register('confirmPassword')}
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className='text-[12px] text-destructive'>
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className='flex justify-end pt-1'>
                  <Button type='submit' disabled={passwordForm.formState.isSubmitting}>
                    {passwordForm.formState.isSubmitting ? 'Alterando...' : 'Alterar senha'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
