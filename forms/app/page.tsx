import Link from "next/link";
import Logo from "@/app/components/logo"
import { Cog6ToothIcon } from "@/app/components/icons";

export default function Home() {
    return (
        <main>
            <div className="sidebar">
                <Logo />
                <Link href="/forms" className="logout-button"><p>Go To Forms</p></Link>
                <Link
                    href="/account"
                    className="logout-button"
                >
                    <Cog6ToothIcon />
                    <p>Account</p>
                </Link>
            </div>


            <div className="documentation">
                <article>
                    <section>
                        <h2>Features Overview</h2>
                        <p>This documentation provides a selection of the features available in the Form Builder App. The app allows for the creation of custom forms with various functionalities tailored to collect the information you need.</p>
                        <p>Please contact <a href="mailto:info@sprout9.nl">info@sprout9.nl</a> for more information.</p>
                    </section>

                    <section>
                        <h3>Configurable Background</h3>
                        <p>Users can customize the background of their forms by selecting from a predefined set of images or uploading their own. This feature helps in enhancing the visual appeal of the form.</p>
                    </section>

                    <section>
                        <h3>Webhooks</h3>
                        <p>Webhooks are available to integrate the form with external services. When a form is submitted, data can be sent automatically to other applications or services in real-time.</p>
                    </section>

                    <section>
                        <h3>Input Questions</h3>
                        <p>The app supports various input question types including short text, long text, multiple choice, and checkboxes. This allows for a wide range of information to be collected through the forms.</p>
                    </section>

                    <section>
                        <h3>Multiple Choice Questions</h3>
                        <p>Users can create multiple choice questions with single or multiple answers. This is ideal for surveys or quizzes where you want respondents to select from a list of options.</p>
                    </section>

                    <section>
                        <h3>Large Text Inputs</h3>
                        <p>For more detailed responses, large text input fields can be added to the forms. This is particularly useful for feedback or descriptive answer formats.</p>
                    </section>

                    <section>
                        <h2>Getting Started</h2>
                        <p>To begin creating your custom form, create an account at <a href="https://forms.sprout9.n/create-account" target="_blank">forms.sprout9.nl/create-account</a>. Then go to <a href="https://forms.sprout9.n/forms" target="_blank">forms.sprout9.nl/forms</a> and follow the intuitive form builder interface.</p>
                    </section>
                </article>
            </div>
        </main >
    )
}
