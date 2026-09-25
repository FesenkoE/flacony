import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import {
    AuthStatus,
    fieldClass,
    footerLinkClass,
    labelClass,
    submitClass,
} from '@/components/brand-auth';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { useTranslations } from '@/hooks/use-translations';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const t = useTranslations();
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title={t('Настройки профиля')} />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title={t('Профиль')}
                    description={t('Имя и email вашего аккаунта')}
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="flex flex-col gap-5"
                >
                    {({ processing, errors, recentlySuccessful }) => (
                        <>
                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass} htmlFor="name">
                                    {t('Имя')}
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    defaultValue={auth.user.name}
                                    required
                                    autoComplete="name"
                                    placeholder={t('Имя и фамилия')}
                                    className={fieldClass}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass} htmlFor="email">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    defaultValue={auth.user.email}
                                    required
                                    autoComplete="username"
                                    placeholder="email@example.com"
                                    className={fieldClass}
                                />
                                <InputError message={errors.email} />
                            </div>

                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <div className="text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                        {t('Email не подтверждён.')}{' '}
                                        <Link
                                            href={send()}
                                            as="button"
                                            className={footerLinkClass}
                                        >
                                            {t('Отправить письмо ещё раз')}
                                        </Link>
                                        {status ===
                                            'verification-link-sent' && (
                                            <AuthStatus>
                                                {t(
                                                    'Новая ссылка отправлена на ваш email',
                                                )}
                                            </AuthStatus>
                                        )}
                                    </div>
                                )}

                            <div className="flex items-center gap-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    data-test="update-profile-button"
                                    className={submitClass}
                                >
                                    {t('Сохранить')}
                                </button>
                                {recentlySuccessful && (
                                    <span className="mt-2 text-sm text-[#7d6952] dark:text-[#b7a58f]">
                                        {t('Сохранено')}
                                    </span>
                                )}
                            </div>
                        </>
                    )}
                </Form>
            </div>

            <DeleteUser />
        </>
    );
}
