import Stripe from "stripe";
import { env } from "./env.js";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY);

// Minimo que cobra Stripe en USD, en centavos
export const MIN_CHECKOUT_AMOUNT = 50;
