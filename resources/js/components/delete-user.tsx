import { Form } from '@inertiajs/react';
import { useRef } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { PasswordField } from '@/components/brand-auth';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useTranslations } from '@/hooks/use-translations';

const dangerButtonClass =
    'rounded-full border border-[#b4432f] px-5 py-2.5 text-sm font-semibold text-[#b4432f] hover:bg-[#b4432f14] disabled:opacity-60 dark:border-[#e07a63] dark:text-[#e07a63] dark:hover:bg-[#e07a6314]';

export default function DeleteUser() {
    const t = useTranslations();
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-4 border-t border-[#1e160c14] pt-10 dark:border-[#ffffff1a]">
            <Heading
                variant="small"
                title={t('Удаление аккаунта')}
                description={t(
                    'Аккаунт, ваши лоты, заказы и отзывы будут удалены навсегда — отменить это нельзя',
                )}
            />

            <Dialog>
                <DialogTrigger asChild>
                    <button
                        type="button"
                        data-test="delete-user-button"
                        className={dangerButtonClass}
                    >
                        {t('Удалить аккаунт')}
                    </button>
                </DialogTrigger>
                <DialogContent className="border-[#1e160c14] bg-[#fffaf1] text-[#241a10] dark:border-[#ffffff1a] dark:bg-[#130f0b] dark:text-[#f6ecdd]">
                    <DialogTitle className="font-display text-xl font-semibold italic">
                        {t('Удалить аккаунт?')}
                    </DialogTitle>
                    <DialogDescription className="text-[#7d6952] dark:text-[#b7a58f]">
                        {t(
                            'Все данные аккаунта будут удалены без возможности восстановления. Введите пароль, чтобы подтвердить.',
                        )}
                    </DialogDescription>

                    <Form
                        {...ProfileController.destroy.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        onError={() => passwordInput.current?.focus()}
                        resetOnSuccess
                        className="flex flex-col gap-5"
                    >
                        {({ resetAndClearErrors, processing, errors }) => (
                            <>
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="password" className="sr-only">
                                        {t('Пароль')}
                                    </label>
                                    <PasswordField
                                        id="password"
                                        name="password"
                                        ref={passwordInput}
                                        placeholder={t('Пароль')}
                                        autoComplete="current-password"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <DialogFooter className="gap-2">
                                    <DialogClose asChild>
                                        <button
                                            type="button"
                                            onClick={() => resetAndClearErrors()}
                                            className="rounded-full border border-[#e6d7bb] px-5 py-2.5 text-sm font-semibold text-[#241a10] dark:border-[#ffffff29] dark:text-[#f6ecdd]"
                                        >
                                            {t('Отмена')}
                                        </button>
                                    </DialogClose>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        data-test="confirm-delete-user-button"
                                        className={dangerButtonClass}
                                    >
                                        {t('Удалить аккаунт')}
                                    </button>
                                </DialogFooter>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
