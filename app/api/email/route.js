import { NextResponse } from 'next/server';
import sgMail from "@sendgrid/mail";

export async function POST(request) {
  
    const { prenom, nom, contenu, email } = await request.json();

	if (!prenom || !nom || !email || !contenu) {
		
		console.log("INVALID_PARAMETER")
		return NextResponse.json({ message: "INVALID_PARAMETER" });
	}

	// Syntaxe adresse email
	const pattern =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!pattern.test(email)) {
		console.log("EMAIL_SYNTAX_INCORRECT")
		return NextResponse.json({ message: "EMAIL_SYNTAX_INCORRECT" });
		
	}

	// Transformer les retours Ã  la ligne pour le HTML
	const message = contenu
		.replace(/\n/g, "<br>")
		.replace(/\r/g, "<br>")
		.replace(/\t/g, "<br>")
		.replace(/<(?!br\s*\/?)[^>]+>/g, "");
  
   // CrÃ©ation du message
	const sendGridMail = {
		to: "contact@pascal-chantrel.fr",
		from: "contact@pascal-chantrel.fr",
		templateId: "d-fd424960d8f346a4a704085701b9ac1c", 
		dynamic_template_data: {
			prenom: prenom,
			nom: nom,
			email: email,
			contenu: message,
		}
	};
    // Donner la clÃ© API
	sgMail.setApiKey(process.env.KEY_SENDGRID);
	

    try {
		
        const {data} = await sgMail.send(sendGridMail);
        return NextResponse.json({
            data
        });

    }
    catch (error) {
        return NextResponse.json({error});
    }
}