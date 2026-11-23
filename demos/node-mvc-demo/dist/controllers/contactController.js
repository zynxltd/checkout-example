import ContactMessage from '../models/ContactMessage.js';
import { contactRepository, jobQueue } from '../lib/appContainer.js';
export function showForm(_req, res) {
    res.render('pages/contact', {
        title: 'Contact',
        errors: [],
        values: { name: '', email: '', message: '' },
        success: null,
    });
}
export function submit(req, res) {
    const name = typeof req.body.name === 'string' ? req.body.name : '';
    const email = typeof req.body.email === 'string' ? req.body.email : '';
    const message = typeof req.body.message === 'string' ? req.body.message : '';
    const errors = ContactMessage.validate({ name, email, message });
    if (errors.length) {
        res.status(422).render('pages/contact', {
            title: 'Contact',
            errors,
            values: { name, email, message },
            success: null,
        });
        return;
    }
    const contact = contactRepository.create({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
    });
    jobQueue.enqueue('lead.follow-up', {
        name: contact.name.trim(),
        email: contact.email,
        reason: 'contact form submitted',
    });
    res.render('pages/contact', {
        title: 'Contact',
        errors: [],
        values: { name: '', email: '', message: '' },
        success: `Thanks, ${contact.name.trim()}. We've logged your message (in-memory demo).`,
    });
}
