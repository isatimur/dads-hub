import { MainLayout } from "@/components/layout/MainLayout";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
    const faqs = {
        basics: [
            {
                question: "Что такое Отец Молодец?",
                answer:
                    "Отец Молодец - это онлайн-платформа, созданная специально для пап, где они могут найти поддержку, советы и общение с другими отцами. Наш сервис помогает папам быть более вовлеченными в воспитание детей и делиться своим опытом.",
            },
            {
                question: "Сервис бесплатный?",
                answer:
                    "Да, основные функции Отец Молодец бесплатны. Мы также предлагаем премиум-подписку с дополнительными возможностями для тех, кто хочет получить больше от нашей платформы.",
            },
            {
                question: "Как начать пользоваться?",
                answer:
                    "Просто зарегистрируйтесь, используя свой email или Google аккаунт. После этого вы сможете создать профиль, присоединиться к сообществу и начать общение с другими папами.",
            },
        ],
        technical: [
            {
                question: "Какие браузеры поддерживаются?",
                answer:
                    "Отец Молодец работает во всех современных браузерах, включая Chrome, Firefox, Safari и Edge. Для лучшего опыта рекомендуем использовать последние версии браузеров.",
            },
            {
                question: "Есть ли мобильное приложение?",
                answer:
                    "В настоящее время мы работаем над мобильным приложением. Пока вы можете пользоваться нашим адаптивным веб-сайтом с любого устройства.",
            },
            {
                question: "Что делать при технических проблемах?",
                answer:
                    "При возникновении технических проблем вы можете обратиться в нашу службу поддержки через форму обратной связи или по email support@otec-molodec.ru.",
            },
        ],
        account: [
            {
                question: "Как изменить настройки профиля?",
                answer:
                    "Войдите в свой аккаунт, перейдите в раздел 'Настройки' и выберите 'Профиль'. Там вы сможете изменить свою информацию, фото и предпочтения.",
            },
            {
                question: "Как обеспечивается безопасность данных?",
                answer:
                    "Мы используем современные методы шифрования и защиты данных. Ваша личная информация надежно защищена и не передается третьим лицам без вашего согласия.",
            },
            {
                question: "Можно ли удалить аккаунт?",
                answer:
                    "Да, вы можете удалить свой аккаунт в любое время через настройки профиля. После удаления вся ваша личная информация будет безвозвратно удалена из нашей системы.",
            },
        ],
        premium: [
            {
                question: "Что включает премиум-подписка?",
                answer:
                    "Премиум-подписка открывает доступ к эксклюзивному контенту, расширенным функциям общения, приоритетной поддержке и отсутствию рекламы.",
            },
            {
                question: "Как оформить премиум-подписку?",
                answer:
                    "Войдите в свой аккаунт, перейдите в раздел 'Премиум' и выберите подходящий план подписки. Оплату можно произвести картой или через электронные платежные системы.",
            },
            {
                question: "Можно ли отменить подписку?",
                answer:
                    "Да, вы можете отменить премиум-подписку в любое время. После отмены вы сможете пользоваться премиум-функциями до конца оплаченного периода.",
            },
        ],
    };

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-8">Часто задаваемые вопросы</h1>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-semibold mb-6">Основное</h2>
                        <div className="space-y-4">
                            {faqs.basics.map((faq, index) => (
                                <Accordion key={index} type="single" collapsible>
                                    <AccordionItem value={`basics-${index}`}>
                                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                                        <AccordionContent>{faq.answer}</AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-6">Технические вопросы</h2>
                        <div className="space-y-4">
                            {faqs.technical.map((faq, index) => (
                                <Accordion key={index} type="single" collapsible>
                                    <AccordionItem value={`technical-${index}`}>
                                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                                        <AccordionContent>{faq.answer}</AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-6">Аккаунт</h2>
                        <div className="space-y-4">
                            {faqs.account.map((faq, index) => (
                                <Accordion key={index} type="single" collapsible>
                                    <AccordionItem value={`account-${index}`}>
                                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                                        <AccordionContent>{faq.answer}</AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-6">Премиум</h2>
                        <div className="space-y-4">
                            {faqs.premium.map((faq, index) => (
                                <Accordion key={index} type="single" collapsible>
                                    <AccordionItem value={`premium-${index}`}>
                                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                                        <AccordionContent>{faq.answer}</AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </MainLayout>
    );
};

export default FAQ;