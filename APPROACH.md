# Approach & Architecture Document

## General Approach

My approach to building the BookLeaf Author Support Portal was centered around three core principles: **Reliability, User Experience, and Scalability.** Given the problem statement—handling communication for 22,000+ titles and mitigating support backlog—the solution needed to be more than just a CRUD app; it required intelligent automation and real-time responsiveness.

I opted for the **MERN stack (MongoDB, Express, React, Node.js)** as it provides a cohesive JavaScript ecosystem, allowing for rapid iteration and seamless integration of WebSockets (Socket.io) for real-time features.

## Architecture Decisions & Trade-offs

1. **AI Integration Strategy (Gemini 2.0 Flash)**
   - **Decision**: I implemented a centralized `aiService.js` that houses the "BookLeaf Knowledge Base" as a context variable. When a ticket is created, the system makes parallel calls to Gemini to classify the category and determine the priority, followed by a context-aware call to draft a response.
   - **Trade-off**: Running AI generation synchronously during ticket creation increases the API response time.
   - **Mitigation**: I implemented `Promise.all` for parallel classification/prioritization and added a graceful degradation block. If the AI API fails or times out, the ticket is still created with default values ("General Inquiry", "Medium") to ensure the author's request is never lost due to a third-party outage.

2. **Real-time Communication (Socket.io)**
   - **Decision**: Implemented WebSockets to push updates instantly. When an author creates a ticket, admins receive a notification. When an admin replies, the author's dashboard updates immediately.
   - **Trade-off**: Managing Socket connections adds complexity to the state and requires sticky sessions or Redis in a multi-instance production environment.
   - **Rationale**: The reduction in support anxiety for authors (seeing their issue being handled in real-time) outweighs the infrastructure complexity.

3. **Database Schema Design**
   - **Decision**: Kept `Tickets`, `Books`, and `Users` as separate collections with references (`ObjectId`). This normalized approach prevents data duplication and allows for efficient querying (e.g., fetching all tickets for a specific book).
   - **Design Choice**: Stored royalty data directly on the `Book` document. In a full production system, royalties might be a separate ledger/transaction collection, but denormalizing it onto the book simplifies the dashboard aggregations.

4. **UI/UX Aesthetics**
   - **Decision**: Built a custom design system using Tailwind CSS, moving away from generic component libraries to deliver a "premium" feel that matches the official BookLeaf website. Used Inter and Playfair Display fonts, a cohesive color palette, and micro-animations.

## Evolving into Production

If I were to take this MVP into a production environment, I would implement the following improvements:

1. **Background Job Processing (BullMQ/Redis)**: Move the AI processing off the main request thread. When a ticket is created, return a 201 immediately and fire a background job to run the AI classification and drafting. Push the results via WebSocket once complete.
2. **Vector Database / RAG**: Instead of hardcoding the Knowledge Base in the prompt, I would implement Retrieval-Augmented Generation (RAG) using Pinecone or MongoDB Vector Search to dynamically inject only the most relevant policy documents into the prompt context, saving tokens and improving accuracy as the company's policies grow.
3. **Email Integration**: Integrate SendGrid to dispatch transactional emails alongside the WebSocket notifications, ensuring authors are updated even when they aren't logged in.
4. **Actual File Uploads**: Replace the placeholder attachment UI with direct-to-S3 pre-signed URL uploads to handle large manuscript or defect images securely.
5. **Pagination & Indexing**: Add cursor-based pagination for the Ticket Queue and All Books views, and ensure MongoDB indexes are properly set on `author`, `status`, and `priority` fields.
