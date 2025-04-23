<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserLengthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->username) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'Missing username'
            ], 400);
        }

        if (strlen($request->username) < 4 || strlen($request->username) > 60) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'Username must be between 4 and 60 characters'
            ], 400);
        }

        return $next($request);
    }
}
